import TA from '@modules/TAs/infra/typeorm/entities/TA';

import { FindManyOptions, FindOneOptions } from 'typeorm';
import ILoadTAsGroupDTO from '../dtos/ILoadTAsGroupDTO';

export default interface ITAsRepository {
  findByStatusAndTipoRede(data: ILoadTAsGroupDTO): Promise<TA[]>;
  findByIds(
    ids: number[],
    options?: FindManyOptions<TA> | undefined,
  ): Promise<TA[]>;
  findById(
    id: number,
    options?: FindOneOptions<TA> | undefined,
  ): Promise<TA | undefined>;
}
