import IUserPreferencesRepository from '@modules/users/repositories/IUserPreferencesRepository';
import 'reflect-metadata';
import groupArray from 'group-array';
import { injectable, inject } from 'tsyringe';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import ISigitmGruposRepository from '@modules/sigitm/repositories/ISigitmGruposRepository';
import IStampsRepository from '@modules/stamps/repositories/IStampsRepository';
import ITPsRepository from '../repositories/ITPsRepository';
import TP from '../infra/bridge/entities/TP';

interface IRequest {
  user_id: string;
  daysBefore: number;
  daysAfter: number;
}

interface ICounter {
  count: number;
  ids: number[];
}

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
  total: ICounter;
  aprovacao: ICounter;
  autorizados: ICounter;
  emExecucao: ICounter;
  foraDoPrazo: ICounter;
  preBaixa: ICounter;
  cancelados: ICounter;
  devolvidos: ICounter;
  flexibilizados: ICounter;
  naoExecutados: ICounter;
  posJanela: {
    executados: ICounter;
    cancelados: ICounter;
    rollback: ICounter;
    parcial: ICounter;
    naoExecutado: ICounter;
    incidencia: ICounter;
    naoClassificado: ICounter;
    total: ICounter;
  };
}

interface ITPGroupArray {
  [key: string]: {
    [key: string]: TP[];
  };
}

interface IResponse {
  groups: ITPGroup[];
  total: ICounter;
  aprovacao: ICounter;
  autorizados: ICounter;
  emExecucao: ICounter;
  foraDoPrazo: ICounter;
  preBaixa: ICounter;
  cancelados: ICounter;
  devolvidos: ICounter;
  flexibilizados: ICounter;
  naoExecutados: ICounter;
  posJanela: {
    executados: ICounter;
    cancelados: ICounter;
    rollback: ICounter;
    parcial: ICounter;
    naoExecutado: ICounter;
    incidencia: ICounter;
    naoClassificado: ICounter;
    total: ICounter;
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

  public async execute({
    user_id,
    daysBefore,
    daysAfter,
  }: IRequest): Promise<IResponse> {
    const cacheKey = `TPsGroups-${daysBefore}-${daysBefore}d`;
    let tps; // await this.cacheProvider.recovery<TP[]>(cacheKey);

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
      let tagStatus = 'untagged';
      if (
        tp.status.nome === 'Pendente Permissão' ||
        tp.status.nome === 'Pendente O&M' ||
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
        tagProjectPerDay: `${tp.projeto}-${tp.dataInicioPrevisto}`,
      };
    });

    const tpsGroup: ITPGroupArray = groupArray(
      tpsWithTag,
      'ciente.grupo.nome',
      'tagStatus',
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
      total: {
        count:
          tpsWithTag?.filter(
            tp =>
              tp.ciente && tp.ciente.grupo && tp.ciente.grupo.id === fila.id,
          ).length || 0,
        ids: [],
      },
      aprovacao: {
        count:
          tpsWithTag?.filter(
            tp =>
              tp.ciente &&
              tp.ciente.grupo &&
              tp.ciente.grupo.id === fila.id &&
              tp.tagStatus === 'Aprovação',
          ).length || 0,
        ids: [],
      },
      autorizados: {
        count:
          tpsWithTag?.filter(
            tp =>
              tp.ciente &&
              tp.ciente.grupo &&
              tp.ciente.grupo.id === fila.id &&
              tp.tagStatus === 'Autorizado',
          ).length || 0,
        ids: [],
      },
      emExecucao: {
        count:
          tpsWithTag?.filter(
            tp =>
              tp.ciente &&
              tp.ciente.grupo &&
              tp.ciente.grupo.id === fila.id &&
              tp.tagStatus === 'Em Execução',
          ).length || 0,
        ids: [],
      },
      foraDoPrazo: {
        count:
          tpsWithTag?.filter(
            tp =>
              tp.ciente &&
              tp.ciente.grupo &&
              tp.ciente.grupo.id === fila.id &&
              tp.tagStatus === 'Fora do Prazo',
          ).length || 0,
        ids: [],
      },
      preBaixa: {
        count:
          tpsWithTag?.filter(
            tp =>
              tp.ciente &&
              tp.ciente.grupo &&
              tp.ciente.grupo.id === fila.id &&
              tp.tagStatus === 'Pré-baixa',
          ).length || 0,
        ids: [],
      },
      cancelados: {
        count:
          tpsWithTag?.filter(
            tp =>
              tp.ciente &&
              tp.ciente.grupo &&
              tp.ciente.grupo.id === fila.id &&
              tp.tagStatus === 'Cancelado',
          ).length || 0,
        ids: [],
      },
      devolvidos: {
        count:
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
        ids: tpsWithTag
          ?.filter(
            tp =>
              tp.ciente &&
              tp.ciente.grupo &&
              tp.ciente.grupo.id === fila.id &&
              tp.carimbos.some(
                carimbo =>
                  carimbo.tipo === 'Devolução' &&
                  carimbo.categoria === 'Devolvido',
              ),
          )
          .map(tp => tp.id),
      },
      flexibilizados: {
        count:
          tpsWithTag?.filter(
            tp =>
              tp.ciente &&
              tp.ciente.grupo &&
              tp.ciente.grupo.id === fila.id &&
              tp.carimbos.some(
                carimbo => carimbo.categoria === 'Flexibilizado',
              ),
          ).length || 0,
        ids: tpsWithTag
          ?.filter(
            tp =>
              tp.ciente &&
              tp.ciente.grupo &&
              tp.ciente.grupo.id === fila.id &&
              tp.carimbos.some(
                carimbo => carimbo.categoria === 'Flexibilizado',
              ),
          )
          .map(tp => tp.id),
      },
      naoExecutados: {
        count:
          tpsWithTag?.filter(
            tp =>
              tp.ciente &&
              tp.ciente.grupo &&
              tp.ciente.grupo.id === fila.id &&
              tp.tagStatus === 'Não Executado ',
          ).length || 0,
        ids: [],
      },
      posJanela: {
        total: {
          count:
            tpsWithTag?.filter(
              tp =>
                tp.ciente &&
                tp.ciente.grupo &&
                tp.ciente.grupo.id === fila.id &&
                tp.status.id >= 70,
            ).length || 0,
          ids: [],
        },
        executados: {
          count:
            tpsWithTag?.filter(
              tp =>
                tp.ciente &&
                tp.ciente.grupo &&
                tp.ciente.grupo.id === fila.id &&
                tp.status.id >= 70 &&
                tp.baixa?.carimbo?.tipo === 'Pré-baixa' &&
                tp.baixa?.carimbo?.categoria === 'Executado',
            ).length || 0,
          ids: tpsWithTag
            ?.filter(
              tp =>
                tp.ciente &&
                tp.ciente.grupo &&
                tp.ciente.grupo.id === fila.id &&
                tp.status.id >= 70 &&
                tp.baixa?.carimbo?.tipo === 'Pré-baixa' &&
                tp.baixa?.carimbo?.categoria === 'Executado',
            )
            .map(tp => tp.id),
        },
        cancelados: {
          count:
            tpsWithTag?.filter(
              tp =>
                tp.ciente &&
                tp.ciente.grupo &&
                tp.ciente.grupo.id === fila.id &&
                tp.status.id >= 70 &&
                tp.baixa?.carimbo?.tipo === 'Pré-baixa' &&
                tp.baixa?.carimbo?.categoria === 'Cancelado',
            ).length || 0,
          ids: [],
        },
        rollback: {
          count:
            tpsWithTag?.filter(
              tp =>
                tp.ciente &&
                tp.ciente.grupo &&
                tp.ciente.grupo.id === fila.id &&
                tp.status.id >= 70 &&
                tp.baixa?.carimbo?.tipo === 'Pré-baixa' &&
                tp.baixa?.carimbo?.categoria === 'Rollback',
            ).length || 0,
          ids: tpsWithTag
            ?.filter(
              tp =>
                tp.ciente &&
                tp.ciente.grupo &&
                tp.ciente.grupo.id === fila.id &&
                tp.status.id >= 70 &&
                tp.baixa?.carimbo?.tipo === 'Pré-baixa' &&
                tp.baixa?.carimbo?.categoria === 'Rollback',
            )
            .map(tp => tp.id),
        },
        parcial: {
          count:
            tpsWithTag?.filter(
              tp =>
                tp.ciente &&
                tp.ciente.grupo &&
                tp.ciente.grupo.id === fila.id &&
                tp.status.id >= 70 &&
                tp.baixa?.carimbo?.tipo === 'Pré-baixa' &&
                tp.baixa?.carimbo?.categoria === 'Parcial',
            ).length || 0,
          ids: tpsWithTag
            ?.filter(
              tp =>
                tp.ciente &&
                tp.ciente.grupo &&
                tp.ciente.grupo.id === fila.id &&
                tp.status.id >= 70 &&
                tp.baixa?.carimbo?.tipo === 'Pré-baixa' &&
                tp.baixa?.carimbo?.categoria === 'Parcial',
            )
            .map(tp => tp.id),
        },
        naoExecutado: {
          count:
            tpsWithTag?.filter(
              tp =>
                tp.ciente &&
                tp.ciente.grupo &&
                tp.ciente.grupo.id === fila.id &&
                tp.status.id >= 70 &&
                tp.baixa?.carimbo?.tipo === 'Pré-baixa' &&
                tp.baixa?.carimbo?.categoria === 'Não Executado',
            ).length || 0,
          ids: [],
        },
        incidencia: {
          count:
            tpsWithTag?.filter(
              tp =>
                tp.ciente &&
                tp.ciente.grupo &&
                tp.ciente.grupo.id === fila.id &&
                tp.status.id >= 70 &&
                tp.baixa?.carimbo?.tipo === 'Pré-baixa' &&
                tp.baixa?.carimbo?.categoria === 'Incidência',
            ).length || 0,
          ids: tpsWithTag
            ?.filter(
              tp =>
                tp.ciente &&
                tp.ciente.grupo &&
                tp.ciente.grupo.id === fila.id &&
                tp.status.id >= 70 &&
                tp.baixa?.carimbo?.tipo === 'Pré-baixa' &&
                tp.baixa?.carimbo?.categoria === 'Incidência',
            )
            .map(tp => tp.id),
        },
        naoClassificado: {
          count:
            tpsWithTag?.filter(
              tp =>
                tp.ciente &&
                tp.ciente.grupo &&
                tp.ciente.grupo.id === fila.id &&
                tp.status.id >= 70 &&
                tp.baixa?.carimbo?.tipo === 'Pré-baixa' &&
                tp.baixa?.carimbo?.categoria === 'Não Classificado',
            ).length || 0,
          ids: [],
        },
      },
    }));

    return {
      groups,
      total: {
        count: tpsWithTag.filter(tp => tp.ciente.grupo).length || 0,
        ids: tpsWithTag.map(tp => tp.id),
      },
      aprovacao: {
        count:
          tpsWithTag.filter(
            tp =>
              tp.ciente.grupo &&
              (tp.tagStatus as ITPGroupItem['status']) === 'Aprovação',
          ).length || 0,
        ids: [],
      },
      autorizados: {
        count:
          tpsWithTag.filter(
            tp =>
              tp.ciente.grupo &&
              (tp.tagStatus as ITPGroupItem['status']) === 'Autorizado',
          ).length || 0,
        ids: [],
      },
      emExecucao: {
        count:
          tpsWithTag.filter(
            tp =>
              tp.ciente.grupo &&
              (tp.tagStatus as ITPGroupItem['status']) === 'Em Execução',
          ).length || 0,
        ids: [],
      },
      foraDoPrazo: {
        count:
          tpsWithTag.filter(
            tp =>
              tp.ciente.grupo &&
              (tp.tagStatus as ITPGroupItem['status']) === 'Fora do Prazo',
          ).length || 0,
        ids: [],
      },
      preBaixa: {
        count:
          tpsWithTag.filter(
            tp =>
              tp.ciente.grupo &&
              (tp.tagStatus as ITPGroupItem['status']) === 'Pré-baixa',
          ).length || 0,
        ids: [],
      },
      cancelados: {
        count:
          tpsWithTag.filter(
            tp => (tp.tagStatus as ITPGroupItem['status']) === 'Cancelado',
          ).length || 0,
        ids: [],
      },
      devolvidos: {
        count:
          tpsWithTag.filter(tp =>
            tp.carimbos.some(
              carimbo =>
                carimbo.tipo === 'Devolução' &&
                carimbo.categoria === 'Devolvido',
            ),
          ).length || 0,
        ids: tpsWithTag
          .filter(tp =>
            tp.carimbos.some(
              carimbo =>
                carimbo.tipo === 'Devolução' &&
                carimbo.categoria === 'Devolvido',
            ),
          )
          .map(tp => tp.id),
      },
      flexibilizados: {
        count:
          tpsWithTag.filter(tp =>
            tp.carimbos.some(carimbo => carimbo.categoria === 'Flexibilizado'),
          ).length || 0,
        ids: tpsWithTag
          .filter(tp =>
            tp.carimbos.some(carimbo => carimbo.categoria === 'Flexibilizado'),
          )
          .map(tp => tp.id),
      },
      naoExecutados: {
        count:
          tpsWithTag.filter(
            tp => (tp.tagStatus as ITPGroupItem['status']) === 'Não Executado',
          ).length || 0,
        ids: [],
      },
      posJanela: {
        total: {
          count: tpsWithTag?.filter(tp => tp.status.id >= 70).length || 0,
          ids: [],
        },
        executados: {
          count:
            tpsWithTag.filter(
              tp =>
                tp.status.id >= 70 &&
                tp.baixa?.carimbo?.tipo === 'Pré-baixa' &&
                tp.baixa?.carimbo?.categoria === 'Executado',
            ).length || 0,
          ids: tpsWithTag
            .filter(
              tp =>
                tp.status.id >= 70 &&
                tp.baixa?.carimbo?.tipo === 'Pré-baixa' &&
                tp.baixa?.carimbo?.categoria === 'Executado',
            )
            .map(tp => tp.id),
        },
        cancelados: {
          count:
            tpsWithTag?.filter(
              tp =>
                tp.status.id >= 70 &&
                tp.baixa?.carimbo?.tipo === 'Pré-baixa' &&
                tp.baixa?.carimbo?.categoria === 'Cancelado',
            ).length || 0,
          ids: [],
        },
        rollback: {
          count:
            tpsWithTag.filter(
              tp =>
                tp.status.id >= 70 &&
                tp.baixa?.carimbo?.tipo === 'Pré-baixa' &&
                tp.baixa?.carimbo?.categoria === 'Rollback',
            ).length || 0,
          ids: tpsWithTag
            .filter(
              tp =>
                tp.status.id >= 70 &&
                tp.baixa?.carimbo?.tipo === 'Pré-baixa' &&
                tp.baixa?.carimbo?.categoria === 'Rollback',
            )
            .map(tp => tp.id),
        },
        parcial: {
          count:
            tpsWithTag.filter(
              tp =>
                tp.status.id >= 70 &&
                tp.baixa?.carimbo?.tipo === 'Pré-baixa' &&
                tp.baixa?.carimbo?.categoria === 'Parcial',
            ).length || 0,
          ids: tpsWithTag
            .filter(
              tp =>
                tp.status.id >= 70 &&
                tp.baixa?.carimbo?.tipo === 'Pré-baixa' &&
                tp.baixa?.carimbo?.categoria === 'Parcial',
            )
            .map(tp => tp.id),
        },
        naoExecutado: {
          count:
            tpsWithTag?.filter(
              tp =>
                tp.status.id >= 70 &&
                tp.baixa?.carimbo?.tipo === 'Pré-baixa' &&
                tp.baixa?.carimbo?.categoria === 'Não Executado',
            ).length || 0,
          ids: [],
        },
        incidencia: {
          count:
            tpsWithTag.filter(
              tp =>
                tp.status.id >= 70 &&
                tp.baixa?.carimbo?.tipo === 'Pré-baixa' &&
                tp.baixa?.carimbo?.categoria === 'Incidência',
            ).length || 0,
          ids: tpsWithTag
            .filter(
              tp =>
                tp.status.id >= 70 &&
                tp.baixa?.carimbo?.tipo === 'Pré-baixa' &&
                tp.baixa?.carimbo?.categoria === 'Incidência',
            )
            .map(tp => tp.id),
        },
        naoClassificado: {
          count:
            tpsWithTag?.filter(
              tp =>
                tp.status.id >= 70 &&
                tp.baixa?.carimbo?.tipo === 'Pré-baixa' &&
                tp.baixa?.carimbo?.categoria === 'Não Classificado',
            ).length || 0,
          ids: [],
        },
      },
    };
  }
}
