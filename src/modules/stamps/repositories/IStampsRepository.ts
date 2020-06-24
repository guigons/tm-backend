import ICreateStampDTO from '../dtos/ICreateStampDTO';
import Stamp from '../infra/typeorm/entities/Stamp';

export default interface IStampRepository {
  findAll(): Promise<Stamp[]>;
  findById(id: string): Promise<Stamp | undefined>;
  findByCod(
    cod: string,
    type_id: string,
    category_id: string,
  ): Promise<Stamp | undefined>;
  create(data: ICreateStampDTO): Promise<Stamp>;
  save(stamp: Stamp): Promise<Stamp>;
  remove(id: string): Promise<void>;
}
