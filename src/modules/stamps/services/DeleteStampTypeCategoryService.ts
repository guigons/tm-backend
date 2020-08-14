import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IStampTypeCategoriesRepository from '../repositories/IStampTypeCategoriesRepository';

interface IRequest {
  id: string;
}

@injectable()
class DeleteStampTypeCategoryService {
  constructor(
    @inject('StampTypeCategoriesRepository')
    private stampTypeCategoriesRepository: IStampTypeCategoriesRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<void> {
    const checkStampTypeCategoryExists = await this.stampTypeCategoriesRepository.findById(
      id,
    );
    if (!checkStampTypeCategoryExists) {
      throw new AppError('Stamp Type Category not found.');
    }
    await this.stampTypeCategoriesRepository.remove(id);
  }
}

export default DeleteStampTypeCategoryService;
