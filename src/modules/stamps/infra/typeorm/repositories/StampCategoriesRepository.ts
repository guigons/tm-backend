import { getRepository, Repository } from 'typeorm';
import StampCategory from '../entities/StampCategory';
import IStampCategoriesRepository from '../../../repositories/IStampCategoriesRepository';
import ICreateStampCategoryDTO from '../../../dtos/ICreateStampTypeCategoryDTO';

class StampCategoryCategoriesRepository implements IStampCategoriesRepository {
  private ormRepository: Repository<StampCategory>;

  constructor() {
    this.ormRepository = getRepository(StampCategory, 'tm');
  }

  public async create(
    stampCategoryData: ICreateStampCategoryDTO,
  ): Promise<StampCategory> {
    const stampCategory = this.ormRepository.create(stampCategoryData);

    await this.ormRepository.save(stampCategory);

    return stampCategory;
  }

  public async save(stampCategory: StampCategory): Promise<StampCategory> {
    return this.ormRepository.save(stampCategory);
  }

  public async findAll(): Promise<StampCategory[]> {
    const stampCategories = await this.ormRepository.find({
      relations: ['stamps'],
    });
    return stampCategories;
  }

  public async findById(id: string): Promise<StampCategory | undefined> {
    const stampCategory = await this.ormRepository.findOne({ where: { id } });

    return stampCategory;
  }

  public async findByName(
    name: string,
    type_id: string,
  ): Promise<StampCategory | undefined> {
    const stampCategory = await this.ormRepository.findOne({
      name,
      type_id,
    });

    return stampCategory;
  }

  public async remove(id: string): Promise<void> {
    await this.ormRepository.delete({ id });
  }
}

export default StampCategoryCategoriesRepository;
