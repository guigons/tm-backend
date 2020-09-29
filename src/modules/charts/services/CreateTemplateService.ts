import { injectable, inject } from 'tsyringe';
// import AppError from '@shared/errors/AppError';
import ITemplatesRepository from '@modules/charts/repositories/ITemplatesRepository';
import Template from '@modules/charts/infra/typeorm/schemas/Template';
import { ObjectId } from 'mongodb';
import TemplatesFilter from '../infra/typeorm/schemas/TemplatesFilter';

interface IRequest {
  _id: string;
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
    _id,
    user_id,
    name,
    global,
    target,
    filters,
  }: IRequest): Promise<Template> {
    const template = await this.templatesRepository.create({
      _id: new ObjectId(_id),
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
