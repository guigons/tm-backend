import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import IStampsRepository from '@modules/sigitm/modules/stamps/repositories/IStampsRepository';
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

    @inject('StampsRepository')
    private stampsRepository: IStampsRepository,
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

    if (!tp) return { tp: undefined };

    const stamps = await this.stampsRepository.findAll();
    tp.setCarimbosDetails(stamps);

    return { tp };
  }
}
