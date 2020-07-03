import TA from '../infra/bridge/entities/TA';

import ILoadTAsGroupDTO from '../dtos/ILoadTAsGroupDTO';

export default interface ITAsRepository {
  findByStatusAndTipoRede(data: ILoadTAsGroupDTO): Promise<TA[]>;
  findByIds(ids: number[]): Promise<TA[]>;
  findById(id: number): Promise<TA | undefined>;
}
