import ICreateStampTypeDTO from '../dtos/ICreateStampTypeDTO';
import StampType from '../infra/typeorm/entities/StampType';

export default interface IStampTypesRepository {
  findAll(): Promise<StampType[]>;
  findById(id: string): Promise<StampType | undefined>;
  findByName(name: string): Promise<StampType | undefined>;
  create(data: ICreateStampTypeDTO): Promise<StampType>;
  save(stampType: StampType): Promise<StampType>;
  remove(id: string): Promise<void>;
}
