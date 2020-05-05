import {
  getRepository,
  Repository,
  WhereExpression,
  Brackets,
  FindManyOptions,
  FindOneOptions,
} from 'typeorm';
import SigitmTA from '@modules/sigitm/infra/typeorm/entities/TA/SigitmTA';
import ISigitmTAsRepository from '@modules/sigitm/repositories/ISigitmTAsRepository';
import ICreateSigitmTADTO from '@modules/sigitm/dtos/ICreateSigitmTADTO';
import ILoadSigitmTasGroupDTO from '@modules/sigitm/dtos/ILoadSigitmTasGroupDTO';

class SigitmTAsRepository implements ISigitmTAsRepository {
  private ormRepository: Repository<SigitmTA>;

  constructor() {
    this.ormRepository = getRepository(SigitmTA, 'sigitm');
  }

  public async findByStatusAndTipoRede({
    status1,
    status2,
    tipoRede1,
    tipoRede2,
  }: ILoadSigitmTasGroupDTO): Promise<SigitmTA[]> {
    const tas = await this.ormRepository.find({
      select: ['id', 'dataCriacao'],
      relations: ['fila'],
      where: (qb: WhereExpression) => {
        qb.where(
          new Brackets((qbRede: WhereExpression) => {
            qbRede
              .where('SigitmTA.idStatus = :status1', { status1 })
              .orWhere('SigitmTA.idStatus = :status2', { status2 });
          }),
        ).andWhere(
          new Brackets((qbRede: WhereExpression) => {
            qbRede
              .where('SigitmTA.idTipoRede = :tipoRede1', { tipoRede1 })
              .orWhere('SigitmTA.idTipoRede = :tipoRede2', { tipoRede2 });
          }),
        );
      },
    });
    return tas;
  }

  public async create({ raiz }: ICreateSigitmTADTO): Promise<SigitmTA> {
    const ta = this.ormRepository.create({});

    await this.ormRepository.save(ta);

    return ta;
  }

  public async findByIds(
    ids: number[],
    options?: FindManyOptions<SigitmTA>,
  ): Promise<SigitmTA[]> {
    const tas = await this.ormRepository.findByIds(ids);

    return tas;
  }

  public async findById(
    id: number,
    options?: FindOneOptions<SigitmTA>,
  ): Promise<SigitmTA | undefined> {
    const ta = await this.ormRepository.findOne(id, options);

    return ta;
  }
}

export default SigitmTAsRepository;
