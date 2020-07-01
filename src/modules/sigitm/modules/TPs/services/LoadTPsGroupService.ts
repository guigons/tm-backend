import IUserPreferencesRepository from '@modules/users/repositories/IUserPreferencesRepository';
import 'reflect-metadata';
import groupArray from 'group-array';
import { injectable, inject } from 'tsyringe';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import ISigitmGruposRepository from '@modules/sigitm/repositories/ISigitmGruposRepository';
import IStampsRepository from '@modules/sigitm/modules/stamps/repositories/IStampsRepository';
import ITPsRepository from '../repositories/ITPsRepository';
import TP from '../infra/typeorm/entities/TP';

interface ITPGroupItem {
  status:
    | 'Aprovação'
    | 'Autorizado'
    | 'Em Execução'
    | 'Fora do Prazo'
    | 'Pré-baixa'
    | 'Cancelado'
    | 'Fechado'
    | 'Não Executado';
  count: number;
  ids: number[];
}

interface ITPGroup {
  grupoResponsavel: string;
  data: ITPGroupItem[] | [];
  total: number;
  aprovacao: number;
  autorizados: number;
  emExecucao: number;
  foraDoPrazo: number;
  preBaixa: number;
  cancelados: number;
  devolvidos: number;
  flexibilizados: number;
  naoExecutados: number;
  fechados: {
    executados: number;
    cancelados: number;
    rollback: number;
    parcial: number;
    naoExecutado: number;
    incidencia: number;
    naoClassificado: number;
    total: number;
  };
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
  autorizados: number;
  emExecucao: number;
  foraDoPrazo: number;
  preBaixa: number;
  cancelados: number;
  devolvidos: number;
  flexibilizados: number;
  naoExecutados: number;
  fechados: {
    executados: number;
    cancelados: number;
    rollback: number;
    parcial: number;
    naoExecutado: number;
    incidencia: number;
    naoClassificado: number;
    total: number;
  };
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

    @inject('StampsRepository')
    private stampsRepository: IStampsRepository,
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
            'baixa',
            'ciente',
            'ciente.usuario',
            'ciente.grupo',
            'historicos',
            'historicos.usuario',
            'historicos.grupo',
          ],
        },
      );

      const stamps = await this.stampsRepository.findAll();
      tps.forEach(tp => tp.setCarimbosDetails(stamps));

      this.cacheProvider.save({ key: cacheKey, value: tps, expire: 15 * 60 });
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

    const status: ITPGroupItem['status'][] = [
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
      autorizados:
        tpsWithTag?.filter(
          tp =>
            tp.ciente &&
            tp.ciente.grupo &&
            tp.ciente.grupo.id === fila.id &&
            tp.tag === 'Autorizado',
        ).length || 0,
      emExecucao:
        tpsWithTag?.filter(
          tp =>
            tp.ciente &&
            tp.ciente.grupo &&
            tp.ciente.grupo.id === fila.id &&
            tp.tag === 'Em Execução',
        ).length || 0,
      foraDoPrazo:
        tpsWithTag?.filter(
          tp =>
            tp.ciente &&
            tp.ciente.grupo &&
            tp.ciente.grupo.id === fila.id &&
            tp.tag === 'Fora do Prazo',
        ).length || 0,
      preBaixa:
        tpsWithTag?.filter(
          tp =>
            tp.ciente &&
            tp.ciente.grupo &&
            tp.ciente.grupo.id === fila.id &&
            tp.tag === 'Pré-baixa',
        ).length || 0,
      cancelados:
        tpsWithTag?.filter(
          tp =>
            tp.ciente &&
            tp.ciente.grupo &&
            tp.ciente.grupo.id === fila.id &&
            tp.tag === 'Cancelado',
        ).length || 0,
      devolvidos:
        tpsWithTag?.filter(
          tp =>
            tp.ciente &&
            tp.ciente.grupo &&
            tp.ciente.grupo.id === fila.id &&
            tp.carimbos.some(
              carimbo =>
                carimbo.tipo === 'Devolução' &&
                carimbo.categoria === 'Devolvido',
            ),
        ).length || 0,
      flexibilizados:
        tpsWithTag?.filter(
          tp =>
            tp.ciente &&
            tp.ciente.grupo &&
            tp.ciente.grupo.id === fila.id &&
            tp.carimbos.some(carimbo => carimbo.categoria === 'Flexibilizado'),
        ).length || 0,
      naoExecutados:
        tpsWithTag?.filter(
          tp =>
            tp.ciente &&
            tp.ciente.grupo &&
            tp.ciente.grupo.id === fila.id &&
            tp.tag === 'Não Executado ',
        ).length || 0,
      fechados: {
        total:
          tpsWithTag?.filter(
            tp =>
              tp.ciente &&
              tp.ciente.grupo &&
              tp.ciente.grupo.id === fila.id &&
              tp.tag === 'Fechado',
          ).length || 0,
        executados:
          tpsWithTag?.filter(
            tp =>
              tp.ciente &&
              tp.ciente.grupo &&
              tp.ciente.grupo.id === fila.id &&
              tp.tag === 'Fechado' &&
              tp.baixa.carimbo?.tipo === 'Pré-baixa' &&
              tp.baixa.carimbo?.categoria === 'Executado',
          ).length || 0,
        cancelados:
          tpsWithTag?.filter(
            tp =>
              tp.ciente &&
              tp.ciente.grupo &&
              tp.ciente.grupo.id === fila.id &&
              tp.tag === 'Fechado' &&
              tp.baixa.carimbo?.tipo === 'Pré-baixa' &&
              tp.baixa.carimbo?.categoria === 'Cancelado',
          ).length || 0,
        rollback:
          tpsWithTag?.filter(
            tp =>
              tp.ciente &&
              tp.ciente.grupo &&
              tp.ciente.grupo.id === fila.id &&
              tp.tag === 'Fechado' &&
              tp.baixa.carimbo?.tipo === 'Pré-baixa' &&
              tp.baixa.carimbo?.categoria === 'Rollback',
          ).length || 0,
        parcial:
          tpsWithTag?.filter(
            tp =>
              tp.ciente &&
              tp.ciente.grupo &&
              tp.ciente.grupo.id === fila.id &&
              tp.tag === 'Fechado' &&
              tp.baixa.carimbo?.tipo === 'Pré-baixa' &&
              tp.baixa.carimbo?.categoria === 'Parcial',
          ).length || 0,
        naoExecutado:
          tpsWithTag?.filter(
            tp =>
              tp.ciente &&
              tp.ciente.grupo &&
              tp.ciente.grupo.id === fila.id &&
              tp.tag === 'Fechado' &&
              tp.baixa.carimbo?.tipo === 'Pré-baixa' &&
              tp.baixa.carimbo?.categoria === 'Não Executado',
          ).length || 0,
        incidencia:
          tpsWithTag?.filter(
            tp =>
              tp.ciente &&
              tp.ciente.grupo &&
              tp.ciente.grupo.id === fila.id &&
              tp.tag === 'Fechado' &&
              tp.baixa.carimbo?.tipo === 'Pré-baixa' &&
              tp.baixa.carimbo?.categoria === 'Incidência',
          ).length || 0,
        naoClassificado:
          tpsWithTag?.filter(
            tp =>
              tp.ciente &&
              tp.ciente.grupo &&
              tp.ciente.grupo.id === fila.id &&
              tp.tag === 'Fechado' &&
              tp.baixa.carimbo?.tipo === 'Pré-baixa' &&
              tp.baixa.carimbo?.categoria === 'Não Classificado',
          ).length || 0,
      },
    }));

    return {
      groups,
      total: tpsWithTag.filter(tp => tp.ciente.grupo).length || 0,
      aprovacao:
        tpsWithTag.filter(
          tp =>
            tp.ciente.grupo &&
            (tp.tag as ITPGroupItem['status']) === 'Aprovação',
        ).length || 0,
      autorizados:
        tpsWithTag.filter(
          tp =>
            tp.ciente.grupo &&
            (tp.tag as ITPGroupItem['status']) === 'Autorizado',
        ).length || 0,
      emExecucao:
        tpsWithTag.filter(
          tp =>
            tp.ciente.grupo &&
            (tp.tag as ITPGroupItem['status']) === 'Em Execução',
        ).length || 0,
      foraDoPrazo:
        tpsWithTag.filter(
          tp =>
            tp.ciente.grupo &&
            (tp.tag as ITPGroupItem['status']) === 'Fora do Prazo',
        ).length || 0,
      preBaixa:
        tpsWithTag.filter(
          tp =>
            tp.ciente.grupo &&
            (tp.tag as ITPGroupItem['status']) === 'Pré-baixa',
        ).length || 0,

      cancelados:
        tpsWithTag.filter(
          tp => (tp.tag as ITPGroupItem['status']) === 'Cancelado',
        ).length || 0,
      devolvidos:
        tpsWithTag.filter(tp =>
          tp.carimbos.some(
            carimbo =>
              carimbo.tipo === 'Devolução' && carimbo.categoria === 'Devolvido',
          ),
        ).length || 0,
      flexibilizados:
        tpsWithTag.filter(tp =>
          tp.carimbos.some(carimbo => carimbo.categoria === 'Flexibilizado'),
        ).length || 0,
      naoExecutados:
        tpsWithTag.filter(
          tp => (tp.tag as ITPGroupItem['status']) === 'Não Executado',
        ).length || 0,
      fechados: {
        total:
          tpsWithTag?.filter(
            tp => (tp.tag as ITPGroupItem['status']) === 'Fechado',
          ).length || 0,
        executados:
          tpsWithTag?.filter(
            tp =>
              (tp.tag as ITPGroupItem['status']) === 'Fechado' &&
              tp.baixa.carimbo?.tipo === 'Pré-baixa' &&
              tp.baixa.carimbo?.categoria === 'Executado',
          ).length || 0,
        cancelados:
          tpsWithTag?.filter(
            tp =>
              (tp.tag as ITPGroupItem['status']) === 'Fechado' &&
              tp.baixa.carimbo?.tipo === 'Pré-baixa' &&
              tp.baixa.carimbo?.categoria === 'Cancelado',
          ).length || 0,
        rollback:
          tpsWithTag?.filter(
            tp =>
              (tp.tag as ITPGroupItem['status']) === 'Fechado' &&
              tp.baixa.carimbo?.tipo === 'Pré-baixa' &&
              tp.baixa.carimbo?.categoria === 'Rollback',
          ).length || 0,
        parcial:
          tpsWithTag?.filter(
            tp =>
              (tp.tag as ITPGroupItem['status']) === 'Fechado' &&
              tp.baixa.carimbo?.tipo === 'Pré-baixa' &&
              tp.baixa.carimbo?.categoria === 'Parcial',
          ).length || 0,
        naoExecutado:
          tpsWithTag?.filter(
            tp =>
              (tp.tag as ITPGroupItem['status']) === 'Fechado' &&
              tp.baixa.carimbo?.tipo === 'Pré-baixa' &&
              tp.baixa.carimbo?.categoria === 'Não Executado',
          ).length || 0,
        incidencia:
          tpsWithTag?.filter(
            tp =>
              (tp.tag as ITPGroupItem['status']) === 'Fechado' &&
              tp.baixa.carimbo?.tipo === 'Pré-baixa' &&
              tp.baixa.carimbo?.categoria === 'Incidência',
          ).length || 0,
        naoClassificado:
          tpsWithTag?.filter(
            tp =>
              (tp.tag as ITPGroupItem['status']) === 'Fechado' &&
              tp.baixa.carimbo?.tipo === 'Pré-baixa' &&
              tp.baixa.carimbo?.categoria === 'Não Classificado',
          ).length || 0,
      },
    };
  }
}
