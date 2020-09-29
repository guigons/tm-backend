import ICreateStampCategoryDTO from '../dtos/ICreateStampCategoryDTO';
import StampCategory from '../infra/typeorm/entities/StampCategory';

export default interface IStampCategoriesRepository {
  findAll(): Promise<StampCategory[]>;
  findById(id: string): Promise<StampCategory | undefined>;
  findByName(name: string, type_id: string): Promise<StampCategory | undefined>;
  create(data: ICreateStampCategoryDTO): Promise<StampCategory>;
  save(stampCategory: StampCategory): Promise<StampCategory>;
  remove(id: string): Promise<void>;
}
