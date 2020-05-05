import {
  getRepository,
  Repository,
  WhereExpression,
  Brackets,
  FindManyOptions,
  FindOneOptions,
} from 'typeorm';
import { subDays, subHours, isBefore } from 'date-fns';
import groupArray from 'group-array';
import SigitmTA from '@modules/sigitm/infra/typeorm/entities/TA/SigitmTA';
import ISigitmRepository from '@modules/sigitm/repositories/ISigitmRepository';
import ICreateSigitmTADTO from '@modules/sigitm/dtos/ICreateSigitmTADTO';
import IGroupTATableResponse from '@modules/sigitm/dtos/IGroupTableResponseDTO';
import IGroupTATable from '@modules/sigitm/dtos/IGroupTableDTO';

class SigitmTARepository implements ISigitmRepository {
  private ormRepository: Repository<SigitmTA>;

  constructor() {
    this.ormRepository = getRepository(SigitmTA, 'sigitm');
  }

  public async findTable(): Promise<IGroupTATableResponse[] | undefined> {
    const tas = await this.ormRepository.find({
      select: ['id', 'dataCriacao'],
      relations: ['fila'],
      where: (qb: WhereExpression) => {
        qb.where(
          new Brackets((qbRede: WhereExpression) => {
            qbRede
              .where('SigitmTA.idStatus = :status1', { status1: 10 })
              .orWhere('SigitmTA.idStatus = :status2', { status2: 70 });
          }),
        ).andWhere(
          new Brackets((qbRede: WhereExpression) => {
            qbRede
              .where('SigitmTA.idTipoRede = :tipoRede1', { tipoRede1: 304 })
              .orWhere('SigitmTA.idTipoRede = :tipoRede2', { tipoRede2: 305 });
          }),
        );
      },
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
    const group: IGroupTATable = groupArray(
      tasWithTag,
      'fila.nome',
      'tag',
    ) as IGroupTATable;

    return Object.keys(group).map(filaNome => ({
      nome: filaNome,
      data: {
        t0h: {
          nome: '+0h',
          count: group[filaNome].t0h ? group[filaNome].t0h.length : 0,
          ids: group[filaNome].t0h
            ? group[filaNome].t0h.map((ta: SigitmTA) => ta.id)
            : [],
        },
        t12h: {
          nome: '+12h',
          count: group[filaNome].t12h ? group[filaNome].t12h.length : 0,
          ids: group[filaNome].t12h
            ? group[filaNome].t12h.map((ta: SigitmTA) => ta.id)
            : [],
        },
        t1d: {
          nome: '+1d',
          count: group[filaNome].t1d ? group[filaNome].t1d.length : 0,
          ids: group[filaNome].t1d
            ? group[filaNome].t1d.map((ta: SigitmTA) => ta.id)
            : [],
        },
        t3d: {
          nome: '+3d',
          count: group[filaNome].t3d ? group[filaNome].t3d.length : 0,
          ids: group[filaNome].t3d
            ? group[filaNome].t3d.map((ta: SigitmTA) => ta.id)
            : [],
        },
        t7d: {
          nome: '+7d',
          count: group[filaNome].t7d ? group[filaNome].t7d.length : 0,
          ids: group[filaNome].t7d
            ? group[filaNome].t7d.map((ta: SigitmTA) => ta.id)
            : [],
        },
        t15d: {
          nome: '+15d',
          count: group[filaNome].t15d ? group[filaNome].t15d.length : 0,
          ids: group[filaNome].t15d
            ? group[filaNome].t15d.map((ta: SigitmTA) => ta.id)
            : [],
        },
        t30d: {
          nome: '+30d',
          count: group[filaNome].t30d ? group[filaNome].t30d.length : 0,
          ids: group[filaNome].t30d
            ? group[filaNome].t30d.map((ta: SigitmTA) => ta.id)
            : [],
        },
        t60d: {
          nome: '+60d',
          count: group[filaNome].t60d ? group[filaNome].t60d.length : 0,
          ids: group[filaNome].t60d
            ? group[filaNome].t60d.map((ta: SigitmTA) => ta.id)
            : [],
        },
        t120d: {
          nome: '+120d',
          count: group[filaNome].t120d ? group[filaNome].t120d.length : 0,
          ids: group[filaNome].t120d
            ? group[filaNome].t120d.map((ta: SigitmTA) => ta.id)
            : [],
        },
        t365d: {
          nome: '+365d',
          count: group[filaNome].t365d ? group[filaNome].t365d.length : 0,
          ids: group[filaNome].t365d
            ? group[filaNome].t365d.map((ta: SigitmTA) => ta.id)
            : [],
        },
      },
    }));
  }

  public async create({ raiz }: ICreateSigitmTADTO): Promise<SigitmTA> {
    const ta = this.ormRepository.create({});

    await this.ormRepository.save(ta);

    return ta;
  }

  public async findByIds(
    ids: string[],
    options?: FindManyOptions<SigitmTA>,
  ): Promise<SigitmTA[]> {
    const tas = await this.ormRepository.findByIds(ids, options);

    return tas;
  }

  public async findOne(
    id: string,
    options?: FindOneOptions<SigitmTA>,
  ): Promise<SigitmTA | undefined> {
    const ta = await this.ormRepository.findOne(id, options);

    return ta;
  }
}

export default SigitmTARepository;
