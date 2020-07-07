import ISigitmGruposRepository from '@modules/sigitm/repositories/ISigitmGruposRepository';
import IUserPreferencesRepository from '@modules/users/repositories/IUserPreferencesRepository';
import 'reflect-metadata';
import { subDays, subHours, isWithinInterval } from 'date-fns';
import groupArray from 'group-array';
import { injectable, inject } from 'tsyringe';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import ITAsRepository from '../repositories/ITAsRepository';
import TA from '../infra/bridge/entities/TA';

interface ITAGroupTag {
  [key: string]: {
    [key: string]: TA[];
  };
}

interface ITAGroupItem {
  time: string;
  count: number;
  ids: number[];
}

interface ITAGroup {
  grupoResponsavel: string;
  data: ITAGroupItem[] | [];
  total: number;
  abertos: number;
  tratamento: number;
  afetacao: number;
}

interface IRequest {
  user_id: string;
}

interface IResponse {
  groups: ITAGroup[];
  total: number;
  abertos: number;
  tratamento: number;
  afetacao: number;
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
    const cacheKey = 'TAs ss';
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
      { tag: '+365d', min: subDays(now, 365), max: subDays(now, 365 * 10) },
      { tag: '+120d', min: subDays(now, 120), max: subDays(now, 365) },
      { tag: '+60d', min: subDays(now, 60), max: subDays(now, 120) },
      { tag: '+30d', min: subDays(now, 30), max: subDays(now, 60) },
      { tag: '+15d', min: subDays(now, 15), max: subDays(now, 30) },
      { tag: '+7d', min: subDays(now, 7), max: subDays(now, 15) },
      { tag: '+3d', min: subDays(now, 3), max: subDays(now, 7) },
      { tag: '+1d', min: subDays(now, 1), max: subDays(now, 3) },
      { tag: '+12h', min: subHours(now, 12), max: subDays(now, 1) },
      { tag: '0h', min: now, max: subHours(now, 12) },
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
        tag: time?.tag,
      };
    });

    const tasGroup: ITAGroupTag = groupArray(
      tasWithTag,
      'fila.nome',
      'tag',
    ) as ITAGroupTag;

    const groups = filas.map(fila => ({
      grupoResponsavel: fila.nome,
      data: times.map(t => ({
        time: t.tag,
        count:
          tasGroup[fila.nome] && tasGroup[fila.nome][t.tag]
            ? tasGroup[fila.nome][t.tag].length
            : 0,
        ids:
          tasGroup[fila.nome] && tasGroup[fila.nome][t.tag]
            ? tasGroup[fila.nome][t.tag].map(ta => ta.id)
            : [],
      })),
      total:
        tasWithTag?.filter(ta => ta.fila && ta.fila.nome === fila.nome)
          .length || 0,
      abertos:
        tasWithTag?.filter(
          ta => ta.fila && ta.fila.nome === fila.nome && !ta.responsavel,
        ).length || 0,
      tratamento:
        tasWithTag?.filter(
          ta => ta.fila && ta.fila.nome === fila.nome && ta.responsavel,
        ).length || 0,
      afetacao: 0,
    }));

    return {
      groups,
      total: tasWithTag?.filter(ta => ta.fila).length || 0,
      abertos: tasWithTag?.filter(ta => ta.fila && !ta.responsavel).length || 0,
      tratamento:
        tasWithTag?.filter(ta => ta.fila && ta.responsavel).length || 0,
      afetacao: 0,
    };
  }
}
