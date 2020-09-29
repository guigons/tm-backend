import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IStampsRepository from '../repositories/IStampsRepository';
import IStampTypesRepository from '../repositories/IStampTypesRepository';
import IStampCategoriesRepository from '../repositories/IStampCategoriesRepository';
import Stamp from '../infra/typeorm/entities/Stamp';

interface IRequest {
  id: string;
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

    @inject('StampCategoriesRepository')
    private stampCategoriesRepository: IStampCategoriesRepository,
  ) {}

  public async execute({
    id,
    cod,
    description,
    type_id,
    category_id,
  }: IRequest): Promise<Stamp> {
    const checkStampExists = await this.stampsRepository.findByCod(cod);
    if (checkStampExists) {
      throw new AppError('Stamp cod already used.');
    }

    const stampType = await this.stampTypesRepository.findById(type_id);
    if (!stampType) {
      throw new AppError('Stamp Type not found.');
    }

    const stampCategory = await this.stampCategoriesRepository.findById(
      category_id,
    );
    if (!stampCategory) {
      throw new AppError('Stamp Type Category not found.');
    }

    const stamp = await this.stampsRepository.create({
      id,
      cod,
      description,
      type_id,
      category_id,
    });

    return stamp;
  }
}

export default CreateStampService;
