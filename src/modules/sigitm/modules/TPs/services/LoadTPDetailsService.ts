import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import ITPsRepository from '../repositories/ITPsRepository';
import TP from '../infra/typeorm/entities/TP';

interface IRequest {
  id: number;
}

interface IResponse {
  tp: TP | undefined;
}

@injectable()
export default class LoadTPDetailsService {
  constructor(
    @inject('TPsRepository')
    private TPsRepository: ITPsRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<IResponse> {
    const tp = await this.TPsRepository.findById(id, {
      relations: [
        'status',
        'impacto',
        'atividade',
        'rede',
        'rede.tipo',
        'tipoPlanta',
        'tipoTrabalho',
        'empresa',
        'tipoAfetacao',
        'motivo',
        'criador',
        'criadorGrupo',
        'responsavel',
        'fila',
        'encerrador',
        'encerradorGrupo',
        'dadosIP',
        'baixa',
        'ciente',
        'ciente.usuario',
        'ciente.grupo',
        'historicos',
        'historicos.usuario',
        'historicos.grupo',
      ],
    });
    return { tp };
  }
}
