import {
  getRepository,
  Repository,
  FindOneOptions,
  FindManyOptions,
  WhereExpression,
  Brackets,
} from 'typeorm';
import TP from '@modules/TPs/infra/typeorm/entities/TP';
import ITPsRepository from '@modules/TPs/repositories/ITPsRepository';
import ILoadTPsGroupDTO from '@modules/TPs/dtos/ILoadTPsGroupDTO';

class TPsRepository implements ITPsRepository {
  private ormRepository: Repository<TP>;

  constructor() {
    this.ormRepository = getRepository(TP, 'sigitm');
  }

  public async findByDateAndTipoRede({
    daysBefore,
    tipoRede1,
    tipoRede2,
  }: ILoadTPsGroupDTO): Promise<TP[]> {
    const tps = await this.ormRepository.find({
      select: ['id', 'dataCriacao'],
      // where: {
      //   id: 6055,
      // },
      relations: ['status', 'responsavelGrupo'],
      where: (qb: WhereExpression) => {
        qb.where(
          new Brackets((qbRede: WhereExpression) => {
            qbRede.where(`TP.TQP_DATA_CRIACAO >= sysdate-${daysBefore}`);
          }),
        ).andWhere(
          new Brackets((qbRede: WhereExpression) => {
            qbRede
              .where('TP.idTipoRede = :tipoRede1', { tipoRede1 })
              .orWhere('TP.idTipoRede = :tipoRede2', { tipoRede2 });
          }),
        );
      },
    });
    return tps;
  }

  public async findByIds(
    ids: number[],
    options: FindManyOptions<TP> | undefined,
  ): Promise<TP[]> {
    const tps = await this.ormRepository.findByIds(ids, options);

    return tps;
  }

  public async findById(
    id: number,
    options?: FindOneOptions<TP> | undefined,
  ): Promise<TP | undefined> {
    const tp = await this.ormRepository.findOne(id, options);

    return tp;
  }
}

export default TPsRepository;
