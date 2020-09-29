import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Stamp from '../infra/typeorm/entities/Stamp';
import IStampsRepository from '../repositories/IStampsRepository';

interface IRequest {
  id: string;
  description?: string;
  cod?: string;
}

@injectable()
class UpdateStampService {
  constructor(
    @inject('StampsRepository')
    private stampsRepository: IStampsRepository,
  ) {}

  public async execute({ id, description, cod }: IRequest): Promise<Stamp> {
    const stamp = await this.stampsRepository.findById(id);
    if (!stamp) {
      throw new AppError('Stamp not found.');
    }

    if (description) {
      stamp.description = description;
    }

    if (cod) {
      stamp.cod = cod;
    }

    await this.stampsRepository.save(stamp);

    return stamp;
  }
}

export default UpdateStampService;
