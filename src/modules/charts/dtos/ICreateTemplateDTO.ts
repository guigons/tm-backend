import TemplatesFilter from '../infra/typeorm/schemas/TemplatesFilter';

export default interface ICreateTemplateDTO {
  _id: string;
  user_id: string;
  name: string;
  global: boolean;
  target: string;
  filters: TemplatesFilter[];
}
