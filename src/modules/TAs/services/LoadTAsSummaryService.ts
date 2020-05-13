import 'reflect-metadata';
import TA from '@modules/TAs/infra/typeorm/entities/TA';
import ITAsRepository from '@modules/TAs/repositories/ITAsRepository';
import { injectable, inject } from 'tsyringe';

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
    const tas = await this.TAsRepository.findByIds(ids, {
      relations: ['responsavel', 'fila', 'criador', 'grupoCriador'],
    });
    return { tas };
  }
}
