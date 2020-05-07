import TP from '@modules/TPs/infra/typeorm/entities/TP';

import { FindManyOptions, FindOneOptions } from 'typeorm';
import ILoadTPsGroupDTO from '../dtos/ILoadTPsGroupDTO';

export default interface ITPsRepository {
  findByDateAndTipoRede(data: ILoadTPsGroupDTO): Promise<TP[]>;
  findByIds(
    ids: number[],
    options?: FindManyOptions<TP> | undefined,
  ): Promise<TP[]>;
  findById(
    id: number,
    options?: FindOneOptions<TP> | undefined,
  ): Promise<TP | undefined>;
}
