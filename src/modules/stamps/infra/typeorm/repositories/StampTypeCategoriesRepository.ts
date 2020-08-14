import { getRepository, Repository } from 'typeorm';
import StampTypeCategory from '../entities/StampTypeCategory';
import IStampTypeCategoriesRepository from '../../../repositories/IStampTypeCategoriesRepository';
import ICreateStampTypeCategoryDTO from '../../../dtos/ICreateStampTypeCategoryDTO';

class StampTypeCategoryCategoriesRepository
  implements IStampTypeCategoriesRepository {
  private ormRepository: Repository<StampTypeCategory>;

  constructor() {
    this.ormRepository = getRepository(StampTypeCategory, 'tm');
  }

  public async create(
    stampTypeCategoryData: ICreateStampTypeCategoryDTO,
  ): Promise<StampTypeCategory> {
    const stampTypeCategory = this.ormRepository.create(stampTypeCategoryData);

    await this.ormRepository.save(stampTypeCategory);

    return stampTypeCategory;
  }

  public async save(
    stampTypeCategory: StampTypeCategory,
  ): Promise<StampTypeCategory> {
    return this.ormRepository.save(stampTypeCategory);
  }

  public async findAll(): Promise<StampTypeCategory[]> {
    const stampTypeCategories = await this.ormRepository.find({
      relations: ['stamps'],
    });
    return stampTypeCategories;
  }

  public async findById(id: string): Promise<StampTypeCategory | undefined> {
    const stampTypeCategory = await this.ormRepository.findOne(id);

    return stampTypeCategory;
  }

  public async findByName(
    name: string,
    type_id: string,
  ): Promise<StampTypeCategory | undefined> {
    const stampTypeCategory = await this.ormRepository.findOne({
      name,
      type_id,
    });

    return stampTypeCategory;
  }

  public async remove(id: string): Promise<void> {
    await this.ormRepository.delete({ id });
  }
}

export default StampTypeCategoryCategoriesRepository;
