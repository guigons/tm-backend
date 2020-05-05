import SigitmTA from '@modules/sigitm/infra/typeorm/entities/TA/SigitmTA';
import ISigitmTAsRepository from '@modules/sigitm/repositories/ISigitmTAsRepository';
import { subDays, subHours, isBefore } from 'date-fns';
import groupArray from 'group-array';
import { injectable, inject } from 'tsyringe';

interface IRequest {
  ids: number[];
}

interface IResponse {
  tas: SigitmTA[];
}

@injectable()
export default class LoadTAsSummaryService {
  constructor(
    @inject('SigitmTAsRepository')
    private sigitmTAsRepository: ISigitmTAsRepository,
  ) {}

  public async execute({ ids }: IRequest): Promise<IResponse> {
    console.log(ids);
    const tas = await this.sigitmTAsRepository.findByIds(ids, {
      relations: ['responsavel', 'fila', 'criador', 'grupoCriador'],
    });
    return { tas };
  }
}
