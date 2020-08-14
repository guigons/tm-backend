import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IStampTypesRepository from '../repositories/IStampTypesRepository';
import StampType from '../infra/typeorm/entities/StampType';

interface IRequest {
  id: string;
  name: string;
}

@injectable()
class CreateStampTypeService {
  constructor(
    @inject('StampTypesRepository')
    private stampTypesRepository: IStampTypesRepository,
  ) {}

  public async execute({ id, name }: IRequest): Promise<StampType> {
    const checkStampTypeExists = await this.stampTypesRepository.findByName(
      name,
    );
    if (checkStampTypeExists) {
      throw new AppError('Stamp Type name already used.');
    }

    const stampType = await this.stampTypesRepository.create({
      id,
      name,
    });

    return stampType;
  }
}

export default CreateStampTypeService;
