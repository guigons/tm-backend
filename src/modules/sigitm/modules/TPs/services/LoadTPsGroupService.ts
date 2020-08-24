/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import IUserPreferencesRepository from '@modules/users/repositories/IUserPreferencesRepository';
import 'reflect-metadata';
import groupArray from 'group-array';
import { injectable, inject } from 'tsyringe';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import ISigitmGruposRepository from '@modules/sigitm/repositories/ISigitmGruposRepository';
import IStampsRepository from '@modules/stamps/repositories/IStampsRepository';
import { format } from 'date-fns';
import ITPsRepository from '../repositories/ITPsRepository';
import TP from '../infra/bridge/entities/TP';

interface IRequest {
  user_id: string;
  daysBefore: number;
  daysAfter: number;
}

interface ICounter {
  numberOfProjects: number;
  numberOfTPs: number;
  ids: number[];
}

interface ITPCounter {
  total: ICounter;
  pendentePermissao: ICounter;
  pendenteOM: ICounter;
  aprovacao: ICounter;
  autorizados: ICounter;
  emExecucao: ICounter;
  foraDoPrazo: ICounter;
  preBaixa: ICounter;
  cancelados: ICounter;
  fechados: ICounter;
  naoExecutados: ICounter;
  devolvidos: ICounter;
  flexibilizados: ICounter;
  posJanela: {
    total: ICounter;
    executados: ICounter;
    cancelados: ICounter;
    rollback: ICounter;
    parcial: ICounter;
    naoExecutado: ICounter;
    incidencia: ICounter;
    naoClassificado: ICounter;
  };
}

interface ITPGroup {
  grupoResponsavel: string;
  counters: ITPCounter;
}

interface ITPGroupArray {
  [key: string]: TP[];
}

interface IResponse {
  groups: ITPGroup[];
  counters: ITPCounter;
}

interface IGetCountersTPsParams {
  groupName: string;
  statusName?: string;
  stamp?: { type?: string; category?: string };
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

  public async execute({
    user_id,
    daysBefore,
    daysAfter,
  }: IRequest): Promise<IResponse> {
    const cacheKey = `TPsGroups-${daysBefore}-${daysBefore}d`;
    let tps = await this.cacheProvider.recovery<TP[]>(cacheKey);

    if (!tps) {
      tps = await this.TPsRepository.findByDataInicioPrevAndTipoRede({
        daysBefore,
        daysAfter,
        tipoRede1: 304,
        tipoRede2: 305,
      });

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

    const tpsWithTag = tpsFiltered.map(tp => {
      let tagStatus = 'untagged';
      if (
        // tp.status.nome === 'Pendente Permissão' ||
        // tp.status.nome === 'Pendente O&M' ||
        tp.status.nome === 'Pendente GMUD' ||
        tp.status.nome === 'Pré-aprovado' ||
        tp.status.nome === 'Levantamento Campo' ||
        tp.status.nome === 'Levantamento Supervisão'
      ) {
        tagStatus = 'Aprovação';
      } else {
        tagStatus = tp.status.nome;
      }

      return {
        ...tp,
        tagStatus,
        tagProjectPerDay: `${tp.projeto}-${format(
          new Date(tp.dataInicioPrevisto),
          'dd/MMM/uuuu',
        )}`,
      };
    });

    const getCountersTPs = (fnFilter: (tp: TP) => {}): ICounter => {
      const filtered = tpsWithTag.filter(tp => fnFilter(Object.assign(tp)));
      const group = groupArray(filtered, 'tagProjectPerDay') as ITPGroupArray;

      return {
        numberOfProjects: Object.entries(group).length,
        numberOfTPs: Object.entries(group).reduce(
          (acc, [, listOfTPs]) => (acc += listOfTPs.length),
          0,
        ),
        ids: Object.entries(group).reduce(
          (acc, [, listOfTPs]) => acc.concat(listOfTPs.map(tp => tp.id)),
          [] as number[],
        ),
      };
    };

    const groups: ITPGroup[] = filas.map(fila => ({
      grupoResponsavel: fila.nome,
      counters: {
        total: getCountersTPs(tp => tp.ciente.grupo.id === fila.id),
        pendentePermissao: getCountersTPs(
          tp =>
            tp.ciente.grupo.id === fila.id &&
            tp.tagStatus === 'Pendente Permissão',
        ),
        pendenteOM: getCountersTPs(
          tp =>
            tp.ciente.grupo.id === fila.id && tp.tagStatus === 'Pendente O&M',
        ),
        aprovacao: getCountersTPs(
          tp => tp.ciente.grupo.id === fila.id && tp.tagStatus === 'Aprovação',
        ),
        autorizados: getCountersTPs(
          tp => tp.ciente.grupo.id === fila.id && tp.tagStatus === 'Autorizado',
        ),
        emExecucao: getCountersTPs(
          tp =>
            tp.ciente.grupo.id === fila.id && tp.tagStatus === 'Em Execução',
        ),
        foraDoPrazo: getCountersTPs(
          tp =>
            tp.ciente.grupo.id === fila.id && tp.tagStatus === 'Fora do Prazo',
        ),
        preBaixa: getCountersTPs(
          tp => tp.ciente.grupo.id === fila.id && tp.tagStatus === 'Pré-baixa',
        ),
        cancelados: getCountersTPs(
          tp => tp.ciente.grupo.id === fila.id && tp.tagStatus === 'Cancelado',
        ),
        fechados: getCountersTPs(
          tp => tp.ciente.grupo.id === fila.id && tp.tagStatus === 'Fechado',
        ),
        naoExecutados: getCountersTPs(
          tp =>
            tp.ciente.grupo.id === fila.id && tp.tagStatus === 'Não Executado',
        ),
        devolvidos: getCountersTPs(
          tp =>
            tp.ciente.grupo.id === fila.id &&
            tp.carimbos.some(
              carimbo =>
                carimbo.tipo === 'Devolução' &&
                carimbo.categoria === 'Devolvido',
            ),
        ),
        flexibilizados: getCountersTPs(
          tp =>
            tp.ciente.grupo.id === fila.id &&
            tp.carimbos.some(carimbo => carimbo.categoria === 'Flexibilizado'),
        ),
        posJanela: {
          total: getCountersTPs(
            tp => tp.ciente.grupo.id === fila.id && tp.status.id >= 70,
          ),
          executados: getCountersTPs(
            tp =>
              tp.ciente.grupo.id === fila.id &&
              tp.status.id >= 70 &&
              tp.baixa?.carimbo?.tipo === 'Pré-baixa' &&
              tp.baixa?.carimbo?.categoria === 'Executado',
          ),
          cancelados: getCountersTPs(
            tp =>
              tp.ciente.grupo.id === fila.id &&
              tp.status.id >= 70 &&
              tp.baixa?.carimbo?.tipo === 'Pré-baixa' &&
              tp.baixa?.carimbo?.categoria === 'Cancelado',
          ),
          rollback: getCountersTPs(
            tp =>
              tp.ciente.grupo.id === fila.id &&
              tp.status.id >= 70 &&
              tp.baixa?.carimbo?.tipo === 'Pré-baixa' &&
              tp.baixa?.carimbo?.categoria === 'Rollback',
          ),
          parcial: getCountersTPs(
            tp =>
              tp.ciente.grupo.id === fila.id &&
              tp.status.id >= 70 &&
              tp.baixa?.carimbo?.tipo === 'Pré-baixa' &&
              tp.baixa?.carimbo?.categoria === 'Parcial',
          ),
          naoExecutado: getCountersTPs(
            tp =>
              tp.ciente.grupo.id === fila.id &&
              tp.status.id >= 70 &&
              tp.baixa?.carimbo?.tipo === 'Pré-baixa' &&
              tp.baixa?.carimbo?.categoria === 'Não Executado',
          ),
          incidencia: getCountersTPs(
            tp =>
              tp.ciente.grupo.id === fila.id &&
              tp.status.id >= 70 &&
              tp.baixa?.carimbo?.tipo === 'Pré-baixa' &&
              tp.baixa?.carimbo?.categoria === 'Incidência',
          ),
          naoClassificado: getCountersTPs(
            tp =>
              tp.ciente.grupo.id === fila.id &&
              tp.status.id >= 70 &&
              tp.baixa?.carimbo?.tipo === 'Pré-baixa' &&
              tp.baixa?.carimbo?.categoria === 'Não Classificado',
          ),
        },
      },
    }));

    return {
      groups,
      counters: {
        total: getCountersTPs(tp => tp),
        pendentePermissao: getCountersTPs(
          tp => tp.tagStatus === 'Pendente Permissão',
        ),
        pendenteOM: getCountersTPs(tp => tp.tagStatus === 'Pendente O&M'),
        aprovacao: getCountersTPs(tp => tp.tagStatus === 'Aprovação'),
        autorizados: getCountersTPs(tp => tp.tagStatus === 'Autorizado'),
        emExecucao: getCountersTPs(tp => tp.tagStatus === 'Em Execução'),
        foraDoPrazo: getCountersTPs(tp => tp.tagStatus === 'Fora do Prazo'),
        preBaixa: getCountersTPs(tp => tp.tagStatus === 'Pré-baixa'),
        cancelados: getCountersTPs(tp => tp.tagStatus === 'Cancelado'),
        fechados: getCountersTPs(tp => tp.tagStatus === 'Fechado'),
        naoExecutados: getCountersTPs(tp => tp.tagStatus === 'Não Executado'),
        devolvidos: getCountersTPs(tp =>
          tp.carimbos.some(
            carimbo =>
              carimbo.tipo === 'Devolução' && carimbo.categoria === 'Devolvido',
          ),
        ),
        flexibilizados: getCountersTPs(tp =>
          tp.carimbos.some(carimbo => carimbo.categoria === 'Flexibilizado'),
        ),
        posJanela: {
          total: getCountersTPs(tp => tp.status.id >= 70),
          executados: getCountersTPs(
            tp =>
              tp.status.id >= 70 &&
              tp.baixa?.carimbo?.tipo === 'Pré-baixa' &&
              tp.baixa?.carimbo?.categoria === 'Executado',
          ),
          cancelados: getCountersTPs(
            tp =>
              tp.status.id >= 70 &&
              tp.baixa?.carimbo?.tipo === 'Pré-baixa' &&
              tp.baixa?.carimbo?.categoria === 'Cancelado',
          ),
          rollback: getCountersTPs(
            tp =>
              tp.status.id >= 70 &&
              tp.baixa?.carimbo?.tipo === 'Pré-baixa' &&
              tp.baixa?.carimbo?.categoria === 'Rollback',
          ),
          parcial: getCountersTPs(
            tp =>
              tp.status.id >= 70 &&
              tp.baixa?.carimbo?.tipo === 'Pré-baixa' &&
              tp.baixa?.carimbo?.categoria === 'Parcial',
          ),
          naoExecutado: getCountersTPs(
            tp =>
              tp.status.id >= 70 &&
              tp.baixa?.carimbo?.tipo === 'Pré-baixa' &&
              tp.baixa?.carimbo?.categoria === 'Não Executado',
          ),
          incidencia: getCountersTPs(
            tp =>
              tp.status.id >= 70 &&
              tp.baixa?.carimbo?.tipo === 'Pré-baixa' &&
              tp.baixa?.carimbo?.categoria === 'Incidência',
          ),
          naoClassificado: getCountersTPs(
            tp =>
              tp.status.id >= 70 &&
              tp.baixa?.carimbo?.tipo === 'Pré-baixa' &&
              tp.baixa?.carimbo?.categoria === 'Não Classificado',
          ),
        },
      },
    };
  }
}
