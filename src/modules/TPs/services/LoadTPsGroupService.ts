import TP from '@modules/TPs/infra/typeorm/entities/TP';
import ITPsRepository from '@modules/TPs/repositories/ITPsRepository';
import { subDays, subHours, isBefore } from 'date-fns';
import groupArray from 'group-array';
import { injectable, inject } from 'tsyringe';

interface ITPGroupItem {
  nome: string;
  count: number;
  ids: number[];
}

interface ITPGroup {
  nome: string;
  data: {
    [key: string]: ITPGroupItem;
  };
}

interface ITPGroupTag {
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
  group: ITPGroup[];
}

@injectable()
export default class LoadTPsGroupService {
  constructor(
    @inject('TPsRepository')
    private TPsRepository: ITPsRepository,
  ) {}

  public async execute(): Promise<IResponse> {
    const tas = await this.TPsRepository.findByStatusAndTipoRede({
      status1: 10,
      status2: 70,
      tipoRede1: 304,
      tipoRede2: 305,
    });

    const now = new Date();
    const tasWithTag = tas.map(tp => {
      let tag = null;
      if (isBefore(new Date(tp.dataCriacao), subDays(now, 365))) {
        tag = 't365d';
      } else if (isBefore(new Date(tp.dataCriacao), subDays(now, 120))) {
        tag = 't120d';
      } else if (isBefore(new Date(tp.dataCriacao), subDays(now, 60))) {
        tag = 't60d';
      } else if (isBefore(new Date(tp.dataCriacao), subDays(now, 30))) {
        tag = 't30d';
      } else if (isBefore(new Date(tp.dataCriacao), subDays(now, 15))) {
        tag = 't15d';
      } else if (isBefore(new Date(tp.dataCriacao), subDays(now, 7))) {
        tag = 't7d';
      } else if (isBefore(new Date(tp.dataCriacao), subDays(now, 3))) {
        tag = 't3d';
      } else if (isBefore(new Date(tp.dataCriacao), subDays(now, 1))) {
        tag = 't1d';
      } else if (isBefore(new Date(tp.dataCriacao), subHours(now, 12))) {
        tag = 't12h';
      } else {
        tag = 't0h';
      }
      return {
        ...tp,
        tag,
      };
    });

    const tpsGroup: ITPGroupTag = groupArray(
      tasWithTag,
      'fila.nome',
      'tag',
    ) as ITPGroupTag;

    const group: ITPGroup[] = Object.keys(tpsGroup).map(filaNome => ({
      nome: filaNome,
      data: {
        t0h: {
          nome: '+0h',
          count: tpsGroup[filaNome].t0h ? tpsGroup[filaNome].t0h.length : 0,
          ids: tpsGroup[filaNome].t0h
            ? tpsGroup[filaNome].t0h.map((ta: TP) => ta.id)
            : [],
        },
        t12h: {
          nome: '+12h',
          count: tpsGroup[filaNome].t12h ? tpsGroup[filaNome].t12h.length : 0,
          ids: tpsGroup[filaNome].t12h
            ? tpsGroup[filaNome].t12h.map((ta: TP) => ta.id)
            : [],
        },
        t1d: {
          nome: '+1d',
          count: tpsGroup[filaNome].t1d ? tpsGroup[filaNome].t1d.length : 0,
          ids: tpsGroup[filaNome].t1d
            ? tpsGroup[filaNome].t1d.map((ta: TP) => ta.id)
            : [],
        },
        t3d: {
          nome: '+3d',
          count: tpsGroup[filaNome].t3d ? tpsGroup[filaNome].t3d.length : 0,
          ids: tpsGroup[filaNome].t3d
            ? tpsGroup[filaNome].t3d.map((ta: TP) => ta.id)
            : [],
        },
        t7d: {
          nome: '+7d',
          count: tpsGroup[filaNome].t7d ? tpsGroup[filaNome].t7d.length : 0,
          ids: tpsGroup[filaNome].t7d
            ? tpsGroup[filaNome].t7d.map((ta: TP) => ta.id)
            : [],
        },
        t15d: {
          nome: '+15d',
          count: tpsGroup[filaNome].t15d ? tpsGroup[filaNome].t15d.length : 0,
          ids: tpsGroup[filaNome].t15d
            ? tpsGroup[filaNome].t15d.map((ta: TP) => ta.id)
            : [],
        },
        t30d: {
          nome: '+30d',
          count: tpsGroup[filaNome].t30d ? tpsGroup[filaNome].t30d.length : 0,
          ids: tpsGroup[filaNome].t30d
            ? tpsGroup[filaNome].t30d.map((ta: TP) => ta.id)
            : [],
        },
        t60d: {
          nome: '+60d',
          count: tpsGroup[filaNome].t60d ? tpsGroup[filaNome].t60d.length : 0,
          ids: tpsGroup[filaNome].t60d
            ? tpsGroup[filaNome].t60d.map((ta: TP) => ta.id)
            : [],
        },
        t120d: {
          nome: '+120d',
          count: tpsGroup[filaNome].t120d ? tpsGroup[filaNome].t120d.length : 0,
          ids: tpsGroup[filaNome].t120d
            ? tpsGroup[filaNome].t120d.map((ta: TP) => ta.id)
            : [],
        },
        t365d: {
          nome: '+365d',
          count: tpsGroup[filaNome].t365d ? tpsGroup[filaNome].t365d.length : 0,
          ids: tpsGroup[filaNome].t365d
            ? tpsGroup[filaNome].t365d.map((ta: TP) => ta.id)
            : [],
        },
      },
    }));

    return { group };
  }
}
