import SigitmTA from '@modules/sigitm/infra/typeorm/entities/TA/SigitmTA';
import ICreateSigitmTADTO from '@modules/sigitm/dtos/ICreateSigitmTADTO';
import IGroupTATableResponse from '../dtos/IGroupTableResponseDTO';
import { FindManyOptions, FindOneOptions } from 'typeorm';

export default interface ISigitmRepository {
  create(data: ICreateSigitmTADTO): Promise<SigitmTA>;
  findTable(): Promise<IGroupTATableResponse[] | undefined>;
  findByIds(
    ids: string[],
    options?: FindManyOptions<SigitmTA> | undefined,
  ): Promise<SigitmTA[] | undefined>;
  findOne(
    id: string,
    options?: FindOneOptions<SigitmTA> | undefined,
  ): Promise<SigitmTA | undefined>;
}
