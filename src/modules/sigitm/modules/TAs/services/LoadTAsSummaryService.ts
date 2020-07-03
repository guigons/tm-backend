import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import TA from '../infra/bridge/entities/TA';
import ITAsRepository from '../repositories/ITAsRepository';

interface IRequest {
  ids: number[];
}

interface IResponse {
  tas: TA[];
}

@injectable()
export default class LoadTAsSummaryService {
  constructor(
    @inject('TAsRepository')
    private TAsRepository: ITAsRepository,
  ) {}

  public async execute({ ids }: IRequest): Promise<IResponse> {
    const tas = await this.TAsRepository.findByIds(ids);
    return { tas };
  }
}
