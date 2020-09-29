import { injectable, inject } from 'tsyringe';
import IStampCategoriesRepository from '../repositories/IStampCategoriesRepository';
import StampCategory from '../infra/typeorm/entities/StampCategory';

@injectable()
class ListStampCategories {
  constructor(
    @inject('StampCategoriesRepository')
    private stampCategoriesRepository: IStampCategoriesRepository,
  ) {}

  public async execute(): Promise<StampCategory[]> {
    const stampCategories = await this.stampCategoriesRepository.findAll();

    return stampCategories;
  }
}

export default ListStampCategories;
