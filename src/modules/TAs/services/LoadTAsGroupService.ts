import 'reflect-metadata';
import TA from '@modules/TAs/infra/typeorm/entities/TA';
import ITAsRepository from '@modules/TAs/repositories/ITAsRepository';
import { subDays, subHours, isWithinInterval } from 'date-fns';
import groupArray from 'group-array';
import { injectable, inject } from 'tsyringe';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface ITAGroupItem {
  time: string;
  count: number;
  ids: number[];
}

interface ITAGroup {
  grupoResponsavel: string;
  data: ITAGroupItem[] | [];
  total: number;
}

interface ITAGroupTag {
  [key: string]: {
    [key: string]: TA[];
  };
}

interface IResponse {
  group: ITAGroup[];
}

@injectable()
export default class LoadTAsGroupService {
  constructor(
    @inject('TAsRepository')
    private TAsRepository: ITAsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(): Promise<IResponse> {
    const cacheKey = 'TAsGroup';
    let group = await this.cacheProvider.recovery<ITAGroup[]>(cacheKey);

    if (!group) {
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

      const tas = await this.TAsRepository.findByStatusAndTipoRede({
        status1: 10,
        status2: 70,
        tipoRede1: 304,
        tipoRede2: 305,
      });

      const tasWithTag = tas.map(ta => {
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

      group = Object.keys(tasGroup).map(grupoResponsavel => ({
        grupoResponsavel,
        data: times.map(t => ({
          time: t.tag,
          count: tasGroup[grupoResponsavel][t.tag]
            ? tasGroup[grupoResponsavel][t.tag].length
            : 0,
          ids: tasGroup[grupoResponsavel][t.tag]
            ? tasGroup[grupoResponsavel][t.tag].map(ta => ta.id)
            : [],
        })),
        total: times.reduce((total, t) => {
          // eslint-disable-next-line no-param-reassign
          total += tasGroup[grupoResponsavel][t.tag]
            ? tasGroup[grupoResponsavel][t.tag].length
            : 0;
          return total;
        }, 0),
      }));

      this.cacheProvider.save({ key: cacheKey, value: group, expire: 10 * 60 });
    }

    return { group };
  }
}
