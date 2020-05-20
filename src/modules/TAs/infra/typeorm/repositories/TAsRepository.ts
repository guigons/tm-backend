import {
  getRepository,
  Repository,
  WhereExpression,
  Brackets,
  FindOneOptions,
  FindManyOptions,
} from 'typeorm';
import TA from '@modules/TAs/infra/typeorm/entities/TA';
import ITAsRepository from '@modules/TAs/repositories/ITAsRepository';
import ILoadTAsGroupDTO from '@modules/TAs/dtos/ILoadTAsGroupDTO';

class TAsRepository implements ITAsRepository {
  private ormRepository: Repository<TA>;

  constructor() {
    this.ormRepository = getRepository(TA, 'sigitm');
  }

  public async findByStatusAndTipoRede({
    status1,
    status2,
    tipoRede1,
    tipoRede2,
  }: ILoadTAsGroupDTO): Promise<TA[]> {
    console.log('TAS FOI NO BANCO!');
    const tas = await this.ormRepository.find({
      select: ['id', 'dataCriacao'],
      relations: ['fila'],
      where: (qb: WhereExpression) => {
        qb.where(
          new Brackets((qbRede: WhereExpression) => {
            qbRede
              .where('TA.idStatus = :status1', { status1 })
              .orWhere('TA.idStatus = :status2', { status2 });
          }),
        ).andWhere(
          new Brackets((qbRede: WhereExpression) => {
            qbRede
              .where('TA.idTipoRede = :tipoRede1', { tipoRede1 })
              .orWhere('TA.idTipoRede = :tipoRede2', { tipoRede2 });
          }),
        );
      },
    });
    return tas;
  }

  public async findByIds(
    ids: number[],
    options: FindManyOptions<TA> | undefined,
  ): Promise<TA[]> {
    const tas = await this.ormRepository.findByIds(ids, options);

    return tas;
  }

  public async findById(
    id: number,
    options?: FindOneOptions<TA> | undefined,
  ): Promise<TA | undefined> {
    const ta = await this.ormRepository.findOne(id, options);

    return ta;
  }
}

export default TAsRepository;
