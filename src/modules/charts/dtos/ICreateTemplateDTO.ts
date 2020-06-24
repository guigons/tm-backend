import TemplatesFilter from '../infra/typeorm/schemas/TemplatesFilter';

export default interface ICreateTemplateDTO {
  user_id: string;
  name: string;
  global: boolean;
  target: string;
  filters: TemplatesFilter[];
}
