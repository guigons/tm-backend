import 'reflect-metadata';
import ITPsRepository from '@modules/TPs/repositories/ITPsRepository';
import { injectable, inject } from 'tsyringe';
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
        'responsavelGrupo',
        'encerrador',
        'encerradorGrupo',
        'dadosIP',
        'baixa',
        'historicos',
        'historicos.usuario',
        'historicos.grupo',
      ],
    });
    return { tp };
  }
}
