import { injectable, inject } from 'tsyringe';
import IStampTypeCategoriesRepository from '../repositories/IStampTypeCategoriesRepository';
import StampType from '../infra/typeorm/entities/StampType';

@injectable()
class ListStampCategories {
  constructor(
    @inject('StampTypeCategoriesRepository')
    private stampTypeCategoriesRepository: IStampTypeCategoriesRepository,
  ) {}

  public async execute(): Promise<StampType[]> {
    const stampsCategories = await this.stampTypeCategoriesRepository.findAll();

    return stampsCategories;
  }
}

export default ListStampCategories;
