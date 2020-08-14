import ICreateStampTypeCategoryDTO from '../dtos/ICreateStampTypeCategoryDTO';
import StampTypeCategory from '../infra/typeorm/entities/StampTypeCategory';

export default interface IStampTypeCategoriesRepository {
  findAll(): Promise<StampTypeCategory[]>;
  findById(id: string): Promise<StampTypeCategory | undefined>;
  findByName(
    name: string,
    type_id: string,
  ): Promise<StampTypeCategory | undefined>;
  create(data: ICreateStampTypeCategoryDTO): Promise<StampTypeCategory>;
  save(stampTypeCategory: StampTypeCategory): Promise<StampTypeCategory>;
  remove(id: string): Promise<void>;
}
