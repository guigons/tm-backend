import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IStampTypesRepository from '../repositories/IStampTypesRepository';

interface IRequest {
  id: string;
}

@injectable()
class DeleteStampTypeService {
  constructor(
    @inject('StampTypesRepository')
    private stampTypesRepository: IStampTypesRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<void> {
    const checkStampTypeExists = await this.stampTypesRepository.findById(id);
    if (!checkStampTypeExists) {
      throw new AppError('Stamp Type not found.');
    }
    await this.stampTypesRepository.remove(id);
  }
}

export default DeleteStampTypeService;
