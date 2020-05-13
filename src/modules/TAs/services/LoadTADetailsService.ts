import 'reflect-metadata';
import TA from '@modules/TAs/infra/typeorm/entities/TA';
import ITAsRepository from '@modules/TAs/repositories/ITAsRepository';
import { injectable, inject } from 'tsyringe';

interface IRequest {
  id: number;
}

interface IResponse {
  ta: TA | undefined;
}

@injectable()
export default class LoadTADetailsService {
  constructor(
    @inject('TAsRepository')
    private TAsRepository: ITAsRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<IResponse> {
    const ta = await this.TAsRepository.findById(id, {
      relations: [
        'responsavel',
        'fila',
        'criador',
        'grupoCriador',
        'status',
        'rede',
        'rede.tipo',
        'dadosIP',
        'baixa',
        'historicos',
        'historicos.usuario',
        'historicos.grupo',
      ],
    });
    return { ta };
  }
}
