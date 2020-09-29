import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import StampCategory from '../infra/typeorm/entities/StampCategory';
import IStampCategoriesRepository from '../repositories/IStampCategoriesRepository';

interface IRequest {
  id: string;
  name?: string;
}

@injectable()
class UpdateStampCategoryService {
  constructor(
    @inject('StampCategoriesRepository')
    private stampCategoriesRepository: IStampCategoriesRepository,
  ) {}

  public async execute({ id, name }: IRequest): Promise<StampCategory> {
    const stampCategpry = await this.stampCategoriesRepository.findById(id);
    if (!stampCategpry) {
      throw new AppError('Stamp category not found.');
    }

    if (name) {
      stampCategpry.name = name;
    }

    await this.stampCategoriesRepository.save(stampCategpry);

    return stampCategpry;
  }
}

export default UpdateStampCategoryService;
