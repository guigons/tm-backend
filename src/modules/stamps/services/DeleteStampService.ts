import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IStampsRepository from '../repositories/IStampsRepository';

interface IRequest {
  id: string;
}

@injectable()
class DeleteStamp {
  constructor(
    @inject('StampsRepository')
    private stampsRepository: IStampsRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<void> {
    const checkStampExists = await this.stampsRepository.findById(id);
    if (!checkStampExists) {
      throw new AppError('Stamp not found.');
    }
    await this.stampsRepository.remove(id);
  }
}

export default DeleteStamp;
