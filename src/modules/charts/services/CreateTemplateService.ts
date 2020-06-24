import { injectable, inject } from 'tsyringe';
// import AppError from '@shared/errors/AppError';
import ITemplatesRepository from '@modules/charts/repositories/ITemplatesRepository';
import Template from '@modules/charts/infra/typeorm/schemas/Template';
import TemplatesFilter from '../infra/typeorm/schemas/TemplatesFilter';

interface IRequest {
  user_id: string;
  name: string;
  global: boolean;
  target: string;
  filters: TemplatesFilter[];
}

@injectable()
class CreateTemplateService {
  constructor(
    @inject('TemplatesRepository')
    private templatesRepository: ITemplatesRepository,
  ) {}

  public async execute({
    user_id,
    name,
    global,
    target,
    filters,
  }: IRequest): Promise<Template> {
    const template = await this.templatesRepository.createTemplate({
      user_id,
      name,
      global,
      target,
      filters,
    });

    return template;
  }
}

export default CreateTemplateService;
