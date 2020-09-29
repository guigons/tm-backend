import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IStampCategoriesRepository from '../repositories/IStampCategoriesRepository';
import IStampTypesRepository from '../repositories/IStampTypesRepository';
import StampCategory from '../infra/typeorm/entities/StampCategory';

interface IRequest {
  id: string;
  name: string;
  type_id: string;
}

@injectable()
class CreateStampCategoryService {
  constructor(
    @inject('StampTypesRepository')
    private stampTypesRepository: IStampTypesRepository,

    @inject('StampCategoriesRepository')
    private stampCategoriesRepository: IStampCategoriesRepository,
  ) {}

  public async execute({
    id,
    name,
    type_id,
  }: IRequest): Promise<StampCategory> {
    const checkStampCategoryExists = await this.stampCategoriesRepository.findByName(
      name,
      type_id,
    );
    if (checkStampCategoryExists) {
      throw new AppError('Stamp Type Category name already used.');
    }

    const stampType = await this.stampTypesRepository.findById(type_id);
    if (!stampType) {
      throw new AppError('Stamp Type not found.');
    }

    const stampCategory = await this.stampCategoriesRepository.create({
      id,
      name,
      type_id,
    });

    return stampCategory;
  }
}

export default CreateStampCategoryService;
