import SigitmTA from '@modules/sigitm/infra/typeorm/entities/TA/SigitmTA';
import ICreateSigitmTADTO from '@modules/sigitm/dtos/ICreateSigitmTADTO';

import ILoadSigitmTasGroupDTO from '../dtos/ILoadSigitmTasGroupDTO';
import { FindManyOptions, FindOneOptions } from 'typeorm';

export default interface ISigitmTAsRepository {
  create(data: ICreateSigitmTADTO): Promise<SigitmTA>;
  findByStatusAndTipoRede(data: ILoadSigitmTasGroupDTO): Promise<SigitmTA[]>;
  findByIds(
    ids: number[],
    options?: FindManyOptions<SigitmTA> | undefined,
  ): Promise<SigitmTA[]>;
  findById(
    id: number,
    options?: FindOneOptions<SigitmTA> | undefined,
  ): Promise<SigitmTA | undefined>;
}
