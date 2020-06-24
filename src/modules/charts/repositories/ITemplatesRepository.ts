import ICreateTemplateDTO from '../dtos/ICreateTemplateDTO';
import IRemoveTemplateDTO from '../dtos/IRemoveTemplateDTO';
import Template from '../infra/typeorm/schemas/Template';
import IFindTemplateDTO from '../dtos/IFindTemplateDTO';

export default interface ITemplatesRepository {
  createTemplate(data: ICreateTemplateDTO): Promise<Template>;
  findTemplateByUserIdAndId(
    data: IFindTemplateDTO,
  ): Promise<Template | undefined>;
  findTemplatesAndGlobals(user_id: string): Promise<Template[]>;
  removeTemplate(data: IRemoveTemplateDTO): Promise<void>;
}
