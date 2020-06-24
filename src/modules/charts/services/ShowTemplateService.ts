import { ObjectID } from 'mongodb';
import { injectable, inject } from 'tsyringe';
// import AppError from '@shared/errors/AppError';
import ITemplatesRepository from '@modules/charts/repositories/ITemplatesRepository';
import Template from '@modules/charts/infra/typeorm/schemas/Template';

interface IRequest {
  user_id: string;
  template_id: ObjectID;
}

@injectable()
class ShowTemplatesService {
  constructor(
    @inject('TemplatesRepository')
    private templatesRepository: ITemplatesRepository,
  ) {}

  public async execute({
    user_id,
    template_id,
  }: IRequest): Promise<Template | undefined> {
    const template = await this.templatesRepository.findTemplateByUserIdAndId({
      user_id,
      template_id,
    });

    return template;
  }
}

export default ShowTemplatesService;
