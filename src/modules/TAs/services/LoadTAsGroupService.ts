import TA from '@modules/TAs/infra/typeorm/entities/TA';
import ITAsRepository from '@modules/TAs/repositories/ITAsRepository';
import { subDays, subHours, isBefore } from 'date-fns';
import groupArray from 'group-array';
import { injectable, inject } from 'tsyringe';

interface ITAGroupItem {
  nome: string;
  count: number;
  ids: number[];
}

interface ITAGroup {
  nome: string;
  data: {
    [key: string]: ITAGroupItem;
  };
}

interface ITAGroupTag {
  [key: string]: {
    t365d: [];
    t120d: [];
    t60d: [];
    t30d: [];
    t15d: [];
    t7d: [];
    t3d: [];
    t1d: [];
    t12h: [];
    t0h: [];
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
  ) {}

  public async execute(): Promise<IResponse> {
    const tas = await this.TAsRepository.findByStatusAndTipoRede({
      status1: 10,
      status2: 70,
      tipoRede1: 304,
      tipoRede2: 305,
    });

    const now = new Date();
    const tasWithTag = tas.map(ta => {
      let tag = null;
      if (isBefore(new Date(ta.dataCriacao), subDays(now, 365))) {
        tag = 't365d';
      } else if (isBefore(new Date(ta.dataCriacao), subDays(now, 120))) {
        tag = 't120d';
      } else if (isBefore(new Date(ta.dataCriacao), subDays(now, 60))) {
        tag = 't60d';
      } else if (isBefore(new Date(ta.dataCriacao), subDays(now, 30))) {
        tag = 't30d';
      } else if (isBefore(new Date(ta.dataCriacao), subDays(now, 15))) {
        tag = 't15d';
      } else if (isBefore(new Date(ta.dataCriacao), subDays(now, 7))) {
        tag = 't7d';
      } else if (isBefore(new Date(ta.dataCriacao), subDays(now, 3))) {
        tag = 't3d';
      } else if (isBefore(new Date(ta.dataCriacao), subDays(now, 1))) {
        tag = 't1d';
      } else if (isBefore(new Date(ta.dataCriacao), subHours(now, 12))) {
        tag = 't12h';
      } else {
        tag = 't0h';
      }
      return {
        ...ta,
        tag,
      };
    });

    const tasGroup: ITAGroupTag = groupArray(
      tasWithTag,
      'fila.nome',
      'tag',
    ) as ITAGroupTag;

    const group: ITAGroup[] = Object.keys(tasGroup).map(filaNome => ({
      nome: filaNome,
      data: {
        t0h: {
          nome: '+0h',
          count: tasGroup[filaNome].t0h ? tasGroup[filaNome].t0h.length : 0,
          ids: tasGroup[filaNome].t0h
            ? tasGroup[filaNome].t0h.map((ta: TA) => ta.id)
            : [],
        },
        t12h: {
          nome: '+12h',
          count: tasGroup[filaNome].t12h ? tasGroup[filaNome].t12h.length : 0,
          ids: tasGroup[filaNome].t12h
            ? tasGroup[filaNome].t12h.map((ta: TA) => ta.id)
            : [],
        },
        t1d: {
          nome: '+1d',
          count: tasGroup[filaNome].t1d ? tasGroup[filaNome].t1d.length : 0,
          ids: tasGroup[filaNome].t1d
            ? tasGroup[filaNome].t1d.map((ta: TA) => ta.id)
            : [],
        },
        t3d: {
          nome: '+3d',
          count: tasGroup[filaNome].t3d ? tasGroup[filaNome].t3d.length : 0,
          ids: tasGroup[filaNome].t3d
            ? tasGroup[filaNome].t3d.map((ta: TA) => ta.id)
            : [],
        },
        t7d: {
          nome: '+7d',
          count: tasGroup[filaNome].t7d ? tasGroup[filaNome].t7d.length : 0,
          ids: tasGroup[filaNome].t7d
            ? tasGroup[filaNome].t7d.map((ta: TA) => ta.id)
            : [],
        },
        t15d: {
          nome: '+15d',
          count: tasGroup[filaNome].t15d ? tasGroup[filaNome].t15d.length : 0,
          ids: tasGroup[filaNome].t15d
            ? tasGroup[filaNome].t15d.map((ta: TA) => ta.id)
            : [],
        },
        t30d: {
          nome: '+30d',
          count: tasGroup[filaNome].t30d ? tasGroup[filaNome].t30d.length : 0,
          ids: tasGroup[filaNome].t30d
            ? tasGroup[filaNome].t30d.map((ta: TA) => ta.id)
            : [],
        },
        t60d: {
          nome: '+60d',
          count: tasGroup[filaNome].t60d ? tasGroup[filaNome].t60d.length : 0,
          ids: tasGroup[filaNome].t60d
            ? tasGroup[filaNome].t60d.map((ta: TA) => ta.id)
            : [],
        },
        t120d: {
          nome: '+120d',
          count: tasGroup[filaNome].t120d ? tasGroup[filaNome].t120d.length : 0,
          ids: tasGroup[filaNome].t120d
            ? tasGroup[filaNome].t120d.map((ta: TA) => ta.id)
            : [],
        },
        t365d: {
          nome: '+365d',
          count: tasGroup[filaNome].t365d ? tasGroup[filaNome].t365d.length : 0,
          ids: tasGroup[filaNome].t365d
            ? tasGroup[filaNome].t365d.map((ta: TA) => ta.id)
            : [],
        },
      },
    }));

    return { group };
  }
}
