import { getRepository, Repository } from 'typeorm';
import Stamp from '../entities/Stamp';
import IStampsRepository from '../../../repositories/IStampsRepository';
import ICreateStampDTO from '../../../dtos/ICreateStampDTO';

class StampsRepository implements IStampsRepository {
  private ormRepository: Repository<Stamp>;

  constructor() {
    this.ormRepository = getRepository(Stamp, 'tm');
  }

  public async create(stampData: ICreateStampDTO): Promise<Stamp> {
    const stamp = this.ormRepository.create(stampData);

    await this.ormRepository.save(stamp);

    return stamp;
  }

  public async save(stamp: Stamp): Promise<Stamp> {
    return this.ormRepository.save(stamp);
  }

  public async findAll(): Promise<Stamp[]> {
    const stamps = await this.ormRepository.find({
      relations: ['type', 'category'],
    });

    return stamps;
  }

  public async findById(id: string): Promise<Stamp | undefined> {
    const stamp = await this.ormRepository.findOne(id);

    return stamp;
  }

  public async findByCod(
    cod: string,
    type_id: string,
    category_id: string,
  ): Promise<Stamp | undefined> {
    const stamp = await this.ormRepository.findOne({
      cod,
      type_id,
    });

    return stamp;
  }

  public async remove(id: string): Promise<void> {
    await this.ormRepository.delete({ id });
  }
}

export default StampsRepository;
