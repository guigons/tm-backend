import { FindManyOptions, FindOneOptions } from 'typeorm';
import TP from '../infra/typeorm/entities/TP';

import ILoadTPsGroupDTO from '../dtos/ILoadTPsGroupDTO';

export default interface ITPsRepository {
  findByDataInicioPrevAndTipoRede(
    data: ILoadTPsGroupDTO,
    options?: FindManyOptions<TP> | undefined,
  ): Promise<TP[]>;
  findByIds(
    ids: number[],
    options?: FindManyOptions<TP> | undefined,
  ): Promise<TP[]>;
  findById(
    id: number,
    options?: FindOneOptions<TP> | undefined,
  ): Promise<TP | undefined>;
}
