import { injectable, inject } from 'tsyringe';
import IStampsRepository from '../repositories/IStampsRepository';
import Stamp from '../infra/typeorm/entities/Stamp';

@injectable()
class ListStampsService {
  constructor(
    @inject('StampsRepository')
    private stampsRepository: IStampsRepository,
  ) {}

  public async execute(): Promise<Stamp[]> {
    const stamps = await this.stampsRepository.findAll();

    return stamps;
  }
}

export default ListStampsService;
