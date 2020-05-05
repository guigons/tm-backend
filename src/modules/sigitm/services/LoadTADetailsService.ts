import SigitmTA from '@modules/sigitm/infra/typeorm/entities/TA/SigitmTA';
import ISigitmTAsRepository from '@modules/sigitm/repositories/ISigitmTAsRepository';
import { subDays, subHours, isBefore } from 'date-fns';
import groupArray from 'group-array';
import { injectable, inject } from 'tsyringe';

interface IRequest {
  id: number;
}

interface IResponse {
  ta: SigitmTA | undefined;
}

@injectable()
export default class LoadTADetailsService {
  constructor(
    @inject('SigitmTAsRepository')
    private sigitmTAsRepository: ISigitmTAsRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<IResponse> {
    const ta = await this.sigitmTAsRepository.findById(id, {
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
