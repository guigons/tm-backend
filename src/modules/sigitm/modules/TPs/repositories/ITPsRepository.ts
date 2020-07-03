import TP from '../infra/bridge/entities/TP';

import ILoadTPsGroupDTO from '../dtos/ILoadTPsGroupDTO';

export default interface ITPsRepository {
  findByDataInicioPrevAndTipoRede(data: ILoadTPsGroupDTO): Promise<TP[]>;
  findByIds(ids: number[]): Promise<TP[]>;
  findById(id: number): Promise<TP | undefined>;
}
