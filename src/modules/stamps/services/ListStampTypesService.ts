import { injectable, inject } from 'tsyringe';
import IStampTypesRepository from '../repositories/IStampTypesRepository';
import StampType from '../infra/typeorm/entities/StampType';

@injectable()
class ListStampTypesService {
  constructor(
    @inject('StampTypesRepository')
    private stampTypesRepository: IStampTypesRepository,
  ) {}

  public async execute(): Promise<StampType[]> {
    const stamps = await this.stampTypesRepository.findAll();

    return stamps;
  }
}

export default ListStampTypesService;
