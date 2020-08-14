import { injectable, inject } from 'tsyringe';
import IStampTypeCategoriesRepository from '../repositories/IStampTypeCategoriesRepository';
import StampTypeCategory from '../infra/typeorm/entities/StampTypeCategory';

@injectable()
class ListStampCategories {
  constructor(
    @inject('StampTypeCategoriesRepository')
    private stampTypeCategoriesRepository: IStampTypeCategoriesRepository,
  ) {}

  public async execute(): Promise<StampTypeCategory[]> {
    const stampTypeCategories = await this.stampTypeCategoriesRepository.findAll();

    return stampTypeCategories;
  }
}

export default ListStampCategories;
