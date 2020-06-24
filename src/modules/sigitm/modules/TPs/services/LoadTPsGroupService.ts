import IUserPreferencesRepository from '@modules/users/repositories/IUserPreferencesRepository';
import 'reflect-metadata';
import groupArray from 'group-array';
import { injectable, inject } from 'tsyringe';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import ISigitmGruposRepository from '@modules/sigitm/repositories/ISigitmGruposRepository';
import ITPsRepository from '../repositories/ITPsRepository';
import TP from '../infra/typeorm/entities/TP';

interface ITPGroupItem {
  status: string;
  count: number;
  ids: number[];
}

interface ITPGroup {
  grupoResponsavel: string;
  data: ITPGroupItem[] | [];
  total: number;
  aprovacao: number;
  cancelados: number;
  fechados: number;
  impacto: number;
}

interface ITPGroupArray {
  [key: string]: {
    [key: string]: TP[];
  };
}

interface IRequest {
  user_id: string;
}

interface IResponse {
  groups: ITPGroup[];
  total: number;
  aprovacao: number;
  cancelados: number;
  fechados: number;
  impacto: number;
}

@injectable()
export default class LoadTPsGroupService {
  constructor(
    @inject('TPsRepository')
    private TPsRepository: ITPsRepository,

    @inject('UserPreferencesRepository')
    private userPreferencesRepository: IUserPreferencesRepository,

    @inject('SigitmGruposRepository')
    private sigitmGruposRepository: ISigitmGruposRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ user_id }: IRequest): Promise<IResponse> {
    const cacheKey = 'TPsGroups';
    let tps = await this.cacheProvider.recovery<TP[]>(cacheKey);

    if (!tps) {
      tps = await this.TPsRepository.findByDataInicioPrevAndTipoRede(
        {
          daysBefore: 7,
          daysAfter: 0,
          tipoRede1: 304,
          tipoRede2: 305,
        },
        {
          select: ['id', 'dataInicioPrevisto'],
          relations: [
            'status',
            'ciente',
            'ciente.usuario',
            'ciente.grupo',
            'historicos',
            'historicos.usuario',
            'historicos.grupo',
          ],
        },
      );

      this.cacheProvider.save({ key: cacheKey, value: tps, expire: 10 * 60 });
    }

    const preferences = await this.userPreferencesRepository.findByUserId(
      user_id,
    );

    const filas_ids = preferences?.filas_tps.map(ftp => Number(ftp.filaId));

    const filas = await this.sigitmGruposRepository.findByIds(filas_ids || []);

    const tpsFiltered = tps.filter(tp => {
      return (
        tp.ciente &&
        tp.ciente.grupo &&
        filas_ids?.length &&
        filas_ids.includes(tp.ciente.grupo.id)
      );
    });

    const status = [
      'Aprovação',
      'Autorizado',
      'Em Execução',
      'Fora do Prazo',
      'Pré-baixa',
      'Cancelado',
      'Fechado',
      'Não Executado',
    ];

    const tpsWithTag = tpsFiltered.map(tp => {
      let tag = 'untagged';
      if (
        tp.status.nome === 'Pendente Permissão' ||
        tp.status.nome === 'Pendente O&M' ||
        tp.status.nome === 'Pendente GMUD' ||
        tp.status.nome === 'Pré-aprovado' ||
        tp.status.nome === 'Levantamento Campo' ||
        tp.status.nome === 'Levantamento Supervisão'
      ) {
        tag = 'Aprovação';
      } else {
        tag = tp.status.nome;
      }

      return {
        ...tp,
        tag,
      };
    });

    const tpsGroup: ITPGroupArray = groupArray(
      tpsWithTag,
      'ciente.grupo.nome',
      'tag',
    ) as ITPGroupArray;

    const groups = filas.map(fila => ({
      grupoResponsavel: fila.nome,
      data: status.map(s => ({
        status: s,
        count:
          tpsGroup[fila.nome] && tpsGroup[fila.nome][s]
            ? tpsGroup[fila.nome][s].length
            : 0,
        ids:
          tpsGroup[fila.nome] && tpsGroup[fila.nome][s]
            ? tpsGroup[fila.nome][s].map(tp => tp.id)
            : [],
      })),
      total:
        tpsWithTag?.filter(
          tp => tp.ciente && tp.ciente.grupo && tp.ciente.grupo.id === fila.id,
        ).length || 0,
      aprovacao:
        tpsWithTag?.filter(
          tp =>
            tp.ciente &&
            tp.ciente.grupo &&
            tp.ciente.grupo.id === fila.id &&
            tp.tag === 'Aprovação',
        ).length || 0,
      fechados:
        tpsWithTag?.filter(
          tp =>
            tp.ciente &&
            tp.ciente.grupo &&
            tp.ciente.grupo.id === fila.id &&
            tp.tag === 'Fechado',
        ).length || 0,
      cancelados:
        tpsWithTag?.filter(
          tp =>
            tp.ciente &&
            tp.ciente.grupo &&
            tp.ciente.grupo.id === fila.id &&
            tp.tag === 'Cancelado',
        ).length || 0,
      impacto:
        tpsWithTag?.filter(
          tp =>
            tp.ciente &&
            tp.ciente.grupo &&
            tp.ciente.grupo.id === fila.id &&
            tp.status.nome === 'Fechado' &&
            !tp.carimbos.some(c => c.codigo === 'PB_01'),
        ).length || 0,
    }));

    return {
      groups,
      total: tpsWithTag.filter(tp => tp.ciente.grupo).length || 0,
      aprovacao:
        tpsWithTag.filter(tp => tp.ciente.grupo && tp.tag === 'Aprovação')
          .length || 0,
      fechados:
        tpsWithTag.filter(tp => tp.ciente.grupo && tp.tag === 'Fechado')
          .length || 0,
      cancelados:
        tpsWithTag.filter(tp => tp.ciente.grupo && tp.tag === 'Cancelado')
          .length || 0,
      impacto:
        tpsWithTag.filter(
          tp =>
            tp.ciente.grupo &&
            tp.status.nome === 'Fechado' &&
            !tp.carimbos.some(c => c.codigo === 'PB_01'),
        ).length || 0,
    };
  }
}
