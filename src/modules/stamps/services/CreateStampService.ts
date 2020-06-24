import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IStampsRepository from '../repositories/IStampsRepository';
import IStampTypesRepository from '../repositories/IStampTypesRepository';
import IStampTypeCategoriesRepository from '../repositories/IStampTypeCategoriesRepository';
import Stamp from '../infra/typeorm/entities/Stamp';

interface IRequest {
  cod: string;
  description: string;
  type_id: string;
  category_id: string;
}

@injectable()
class CreateStampService {
  constructor(
    @inject('StampsRepository')
    private stampsRepository: IStampsRepository,

    @inject('StampTypesRepository')
    private stampTypesRepository: IStampTypesRepository,

    @inject('StampTypeCategoriesRepository')
    private stampTypeCategoriesRepository: IStampTypeCategoriesRepository,
  ) {}

  public async execute({
    cod,
    description,
    type_id,
    category_id,
  }: IRequest): Promise<Stamp> {
    const checkStampExists = await this.stampsRepository.findByCod(
      cod,
      type_id,
      category_id,
    );
    if (checkStampExists) {
      throw new AppError('Stamp cod already used.');
    }

    const stampType = await this.stampTypesRepository.findById(type_id);
    if (!stampType) {
      throw new AppError('Stamp Type not found.');
    }

    const stampTypeCategory = await this.stampTypeCategoriesRepository.findById(
      category_id,
    );
    if (!stampTypeCategory) {
      throw new AppError('Stamp Type Category not found.');
    }

    const stamp = await this.stampsRepository.create({
      cod,
      description,
      type_id,
      category_id,
    });

    return stamp;
  }
}

export default CreateStampService;
