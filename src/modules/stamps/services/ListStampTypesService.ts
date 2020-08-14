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
    const stampTypes = await this.stampTypesRepository.findAll();

    return stampTypes;
  }
}

export default ListStampTypesService;
