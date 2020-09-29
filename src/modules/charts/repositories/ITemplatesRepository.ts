import IRemoveTemplateDTO from '../dtos/IRemoveTemplateDTO';
import Template from '../infra/typeorm/schemas/Template';
import IFindTemplateDTO from '../dtos/IFindTemplateDTO';

export default interface ITemplatesRepository {
  create(template: Template): Promise<Template>;
  save(template: Template): Promise<Template>;
  findTemplateByUserIdAndId(
    data: IFindTemplateDTO,
  ): Promise<Template | undefined>;
  findTemplatesAndGlobals(user_id: string): Promise<Template[]>;
  removeTemplate(data: IRemoveTemplateDTO): Promise<void>;
}
