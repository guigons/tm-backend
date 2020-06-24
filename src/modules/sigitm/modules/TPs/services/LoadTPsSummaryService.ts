import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import TP from '../infra/typeorm/entities/TP';
import ITPsRepository from '../repositories/ITPsRepository';

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
      relations: [
        'responsavel',
        'fila',
        'criador',
        'criadorGrupo',
        'ciente',
        'ciente.usuario',
        'ciente.grupo',
      ],
    });
    return { tps };
  }
}
