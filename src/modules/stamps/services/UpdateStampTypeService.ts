import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import StampType from '../infra/typeorm/entities/StampType';
import IStampTypesRepository from '../repositories/IStampTypesRepository';

interface IRequest {
  id: string;
  name?: string;
}

@injectable()
class UpdateStampTypeService {
  constructor(
    @inject('StampTypesRepository')
    private stampTypesRepository: IStampTypesRepository,
  ) {}

  public async execute({ id, name }: IRequest): Promise<StampType> {
    const stampType = await this.stampTypesRepository.findById(id);
    if (!stampType) {
      throw new AppError('Stamp type not found.');
    }

    if (name) {
      stampType.name = name;
    }

    await this.stampTypesRepository.save(stampType);

    return stampType;
  }
}

export default UpdateStampTypeService;
