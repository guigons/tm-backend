import { injectable, inject } from 'tsyringe';
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
    await this.stampsRepository.remove(id);
  }
}

export default DeleteStamp;
