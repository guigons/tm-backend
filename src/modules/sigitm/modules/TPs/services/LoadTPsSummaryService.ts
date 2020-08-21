import groupArray from 'group-array';
import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import IStampsRepository from '@modules/stamps/repositories/IStampsRepository';
import { format } from 'date-fns';
import TP from '../infra/bridge/entities/TP';
import ITPsRepository from '../repositories/ITPsRepository';

interface IRequest {
  ids: number[];
}

interface IResponse {
  [key: string]: {
    [key: string]: TP[];
  };
}

@injectable()
export default class LoadTPsSummaryService {
  constructor(
    @inject('TPsRepository')
    private TPsRepository: ITPsRepository,

    @inject('StampsRepository')
    private stampsRepository: IStampsRepository,
  ) {}

  public async execute({ ids }: IRequest): Promise<IResponse> {
    const tps = await this.TPsRepository.findByIds(ids);
    const stamps = await this.stampsRepository.findAll();
    tps.forEach(tp => tp.setCarimbosDetails(stamps));
    const tpsWithTags = tps.map(tp =>
      Object.assign(tp, {
        ...tp,
        tagDate: `${format(new Date(tp.dataInicioPrevisto), 'dd/MMM/uuuu')}`,
      }),
    );
    const group = groupArray(tpsWithTags, 'projeto', 'tagDate') as IResponse;
    return group;
  }
}
