import { injectable, inject } from 'tsyringe';
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
    await this.stampTypeCategoriesRepository.remove(id);
  }
}

export default DeleteStampTypeCategoryService;
