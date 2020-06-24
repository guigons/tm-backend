import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IStampTypeCategoriesRepository from '../repositories/IStampTypeCategoriesRepository';
import IStampTypesRepository from '../repositories/IStampTypesRepository';
import StampType from '../infra/typeorm/entities/StampType';

interface IRequest {
  name: string;
  type_id: string;
}

@injectable()
class CreateStampTypeCategoryService {
  constructor(
    @inject('StampTypesRepository')
    private stampTypesRepository: IStampTypesRepository,

    @inject('StampTypeCategoriesRepository')
    private stampTypeCategoriesRepository: IStampTypeCategoriesRepository,
  ) {}

  public async execute({ name, type_id }: IRequest): Promise<StampType> {
    const checkStampTypeCategoryExists = await this.stampTypeCategoriesRepository.findByName(
      name,
      type_id,
    );
    if (checkStampTypeCategoryExists) {
      throw new AppError('Stamp Type Category name already used.');
    }

    const stampType = await this.stampTypesRepository.findById(type_id);
    if (!stampType) {
      throw new AppError('Stamp Type not found.');
    }

    const stampTypeCategory = await this.stampTypeCategoriesRepository.create({
      name,
      type_id,
    });

    return stampTypeCategory;
  }
}

export default CreateStampTypeCategoryService;
