import 'reflect-metadata';
import TP from '@modules/TPs/infra/typeorm/entities/TP';
import ITPsRepository from '@modules/TPs/repositories/ITPsRepository';
import { injectable, inject } from 'tsyringe';

interface IRequest {
  ids: number[];
}

interface IResponse {
  tps: TP[];
}

@injectable()
export default class LoadTPsSummaryService {
  constructor(
    @inject('TPsRepository')
    private TPsRepository: ITPsRepository,
  ) {}

  public async execute({ ids }: IRequest): Promise<IResponse> {
    const tps = await this.TPsRepository.findByIds(ids, {
      relations: ['responsavel', 'responsavelGrupo', 'criador', 'criadorGrupo'],
    });
    return { tps };
  }
}
