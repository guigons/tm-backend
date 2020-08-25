/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import ISigitmGruposRepository from '@modules/sigitm/repositories/ISigitmGruposRepository';
import IUserPreferencesRepository from '@modules/users/repositories/IUserPreferencesRepository';
import 'reflect-metadata';
import { subDays, subHours, isWithinInterval } from 'date-fns';
import groupArray from 'group-array';
import { injectable, inject } from 'tsyringe';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { boolean } from '@hapi/joi';
import ITAsRepository from '../repositories/ITAsRepository';
import TA from '../infra/bridge/entities/TA';

interface IRequest {
  user_id: string;
}

interface ICounter {
  numberOfTAsIP: number;
  numberOfTAsMetro: number;
  idsIP: number[];
  idsMetro: number[];
  hasAfetacaoIP: boolean;
  hasAfetacaoMetro: boolean;
}

interface ITACounter {
  t0h: ICounter;
  t12h: ICounter;
  t1d: ICounter;
  t3d: ICounter;
  t7d: ICounter;
  t15d: ICounter;
  t30d: ICounter;
  t60d: ICounter;
  t120d: ICounter;
  t365d: ICounter;
  total: ICounter;
  abertos: ICounter;
  emTratamento: ICounter;
  comAfetacao: ICounter;
}

interface ITAGroup {
  grupoResponsavel: string;
  counters: ITACounter;
}

interface ITAGroupArray {
  [key: string]: TA[];
}

interface IResponse {
  groups: ITAGroup[];
  counters: ITACounter;
}

@injectable()
export default class LoadTAsGroupService {
  constructor(
    @inject('TAsRepository')
    private TAsRepository: ITAsRepository,

    @inject('UserPreferencesRepository')
    private userPreferencesRepository: IUserPreferencesRepository,

    @inject('SigitmGruposRepository')
    private sigitmGruposRepository: ISigitmGruposRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ user_id }: IRequest): Promise<IResponse> {
    const cacheKey = 'TAs';
    let tas = await this.cacheProvider.recovery<TA[]>(cacheKey);

    if (!tas) {
      tas = await this.TAsRepository.findByStatusAndTipoRede({
        status1: 10,
        status2: 70,
        tipoRede1: 304,
        tipoRede2: 305,
      });

      this.cacheProvider.save({ key: cacheKey, value: tas, expire: 15 * 60 });
    }

    const now = new Date();
    const times = [
      { tag: 't365d', min: subDays(now, 365), max: subDays(now, 365 * 10) },
      { tag: 't120d', min: subDays(now, 120), max: subDays(now, 365) },
      { tag: 't60d', min: subDays(now, 60), max: subDays(now, 120) },
      { tag: 't30d', min: subDays(now, 30), max: subDays(now, 60) },
      { tag: 't15d', min: subDays(now, 15), max: subDays(now, 30) },
      { tag: 't7d', min: subDays(now, 7), max: subDays(now, 15) },
      { tag: 't3d', min: subDays(now, 3), max: subDays(now, 7) },
      { tag: 't1d', min: subDays(now, 1), max: subDays(now, 3) },
      { tag: 't12h', min: subHours(now, 12), max: subDays(now, 1) },
      { tag: 't0h', min: now, max: subHours(now, 12) },
    ];

    const preferences = await this.userPreferencesRepository.findByUserId(
      user_id,
    );

    const filas_ids = preferences?.filas_tas.map(fta => Number(fta.filaId));

    const filas = await this.sigitmGruposRepository.findByIds(filas_ids || []);

    const tasFiltered = tas.filter(
      ta => ta.fila && filas_ids?.length && filas_ids.includes(ta.fila.id),
    );

    const tasWithTag = tasFiltered.map(ta => {
      const taDataCricao = new Date(ta.dataCriacao);
      const time = times.find(t =>
        isWithinInterval(taDataCricao, { start: t.max, end: t.min }),
      );
      return {
        ...ta,
        tagTime: time?.tag,
      };
    });

    const getCountersTAs = (fnFilter: (ta: TA) => {}): ICounter => {
      const filtered = tasWithTag.filter(ta => fnFilter(Object.assign(ta)));
      const group = groupArray(filtered, 'tagTime') as ITAGroupArray;

      const listOfTAsIP = Object.entries(group).reduce(
        (acc, [, listOfTAs]) =>
          acc.concat(listOfTAs.filter(ta => ta.rede.nome === 'IP')),
        [] as TA[],
      );

      const listOfTAsMetro = Object.entries(group).reduce(
        (acc, [, listOfTAs]) =>
          acc.concat(listOfTAs.filter(ta => ta.rede.nome === 'Metro')),
        [] as TA[],
      );

      return {
        numberOfTAsIP: listOfTAsIP.length,
        numberOfTAsMetro: listOfTAsMetro.length,
        idsIP: listOfTAsIP.map(ta => ta.id),
        idsMetro: listOfTAsMetro.map(ta => ta.id),
        hasAfetacaoIP: listOfTAsIP.some(ta => ta.afetacao.isAfetacaoParcial),
        hasAfetacaoMetro: listOfTAsMetro.some(
          ta => ta.afetacao.isAfetacaoParcial,
        ),
      };
    };

    const groups: ITAGroup[] = filas.map(fila => ({
      grupoResponsavel: fila.nome,
      counters: {
        t0h: getCountersTAs(
          ta => ta.fila && ta.fila.nome === fila.nome && ta.tagTime === 't0h',
        ),
        t12h: getCountersTAs(
          ta => ta.fila && ta.fila.nome === fila.nome && ta.tagTime === 't12h',
        ),
        t1d: getCountersTAs(
          ta => ta.fila && ta.fila.nome === fila.nome && ta.tagTime === 't1d',
        ),
        t3d: getCountersTAs(
          ta => ta.fila && ta.fila.nome === fila.nome && ta.tagTime === 't3d',
        ),
        t7d: getCountersTAs(
          ta => ta.fila && ta.fila.nome === fila.nome && ta.tagTime === 't7d',
        ),
        t15d: getCountersTAs(
          ta => ta.fila && ta.fila.nome === fila.nome && ta.tagTime === 't15d',
        ),
        t30d: getCountersTAs(
          ta => ta.fila && ta.fila.nome === fila.nome && ta.tagTime === 't30d',
        ),
        t60d: getCountersTAs(
          ta => ta.fila && ta.fila.nome === fila.nome && ta.tagTime === 't60d',
        ),
        t120d: getCountersTAs(
          ta => ta.fila && ta.fila.nome === fila.nome && ta.tagTime === 't120d',
        ),
        t365d: getCountersTAs(
          ta => ta.fila && ta.fila.nome === fila.nome && ta.tagTime === 't365d',
        ),
        total: getCountersTAs(ta => ta.fila && ta.fila.nome === fila.nome),
        abertos: getCountersTAs(
          ta => ta.fila && ta.fila.nome === fila.nome && !ta.responsavel,
        ),
        emTratamento: getCountersTAs(
          ta => ta.fila && ta.fila.nome === fila.nome && ta.responsavel,
        ),
        comAfetacao: getCountersTAs(
          ta =>
            ta.fila &&
            ta.fila.nome === fila.nome &&
            ta.afetacao.isAfetacaoParcial,
        ),
      },
    }));

    return {
      groups,
      counters: {
        t0h: getCountersTAs(ta => ta.tagTime === 't0h'),
        t12h: getCountersTAs(ta => ta.tagTime === 't12h'),
        t1d: getCountersTAs(ta => ta.tagTime === 't1d'),
        t3d: getCountersTAs(ta => ta.tagTime === 't3d'),
        t7d: getCountersTAs(ta => ta.tagTime === 't7d'),
        t15d: getCountersTAs(ta => ta.tagTime === 't15d'),
        t30d: getCountersTAs(ta => ta.tagTime === 't30d'),
        t60d: getCountersTAs(ta => ta.tagTime === 't60d'),
        t120d: getCountersTAs(ta => ta.tagTime === 't120d'),
        t365d: getCountersTAs(ta => ta.tagTime === 't365d'),
        total: getCountersTAs(ta => ta),
        abertos: getCountersTAs(ta => !ta.responsavel),
        emTratamento: getCountersTAs(ta => ta.responsavel),
        comAfetacao: getCountersTAs(ta => ta.afetacao.isAfetacaoParcial),
      },
    };
  }
}
