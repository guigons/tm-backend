import { getRepository, Repository } from 'typeorm';
import StampType from '../entities/StampType';
import IStampTypesRepository from '../../../repositories/IStampTypesRepository';
import ICreateStampTypeDTO from '../../../dtos/ICreateStampTypeDTO';

class StampTypesRepository implements IStampTypesRepository {
  private ormRepository: Repository<StampType>;

  constructor() {
    this.ormRepository = getRepository(StampType, 'tm');
  }

  public async create(stampTypeData: ICreateStampTypeDTO): Promise<StampType> {
    const stampType = this.ormRepository.create(stampTypeData);

    await this.ormRepository.save(stampType);

    return stampType;
  }

  public async save(stampType: StampType): Promise<StampType> {
    return this.ormRepository.save(stampType);
  }

  public async findAll(): Promise<StampType[]> {
    const stampTypes = await this.ormRepository.find({
      relations: ['categories', 'categories.stamps'],
    });
    return stampTypes;
  }

  public async findById(id: string): Promise<StampType | undefined> {
    const stampType = await this.ormRepository.findOne(id);

    return stampType;
  }

  public async findByName(name: string): Promise<StampType | undefined> {
    const stampType = await this.ormRepository.findOne({ name });

    return stampType;
  }

  public async remove(id: string): Promise<void> {
    await this.ormRepository.delete({ id });
  }
}

export default StampTypesRepository;
