import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IStampCategoriesRepository from '../repositories/IStampCategoriesRepository';

interface IRequest {
  id: string;
}

@injectable()
class DeleteStampCategoryService {
  constructor(
    @inject('StampCategoriesRepository')
    private stampCategoriesRepository: IStampCategoriesRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<void> {
    const checkStampCategoryExists = await this.stampCategoriesRepository.findById(
      id,
    );
    if (!checkStampCategoryExists) {
      throw new AppError('Stamp Type Category not found.');
    }
    await this.stampCategoriesRepository.remove(id);
  }
}

export default DeleteStampCategoryService;
