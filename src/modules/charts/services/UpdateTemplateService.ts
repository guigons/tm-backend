import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { injectable, inject } from 'tsyringe';
import ITemplatesRepository from '@modules/charts/repositories/ITemplatesRepository';
import { ObjectId } from 'mongodb';
import TemplatesFilter from '../infra/typeorm/schemas/TemplatesFilter';

interface IRequest {
  user_id: string;
  template_id: ObjectId;
  name?: string;
  global?: boolean;
  target?: string;
  filters?: TemplatesFilter[];
}

@injectable()
class UpdateTemplateService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('TemplatesRepository')
    private templatesRepository: ITemplatesRepository,
  ) {}

  public async execute({
    user_id,
    template_id,
    name,
    global,
    target,
    filters,
  }: IRequest): Promise<void> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new AppError('User not found');
    }

    const template = await this.templatesRepository.findTemplateByUserIdAndId({
      user_id,
      template_id,
    });

    if (!template) {
      throw new AppError('Template not found');
    }

    if (name) {
      template.name = name;
    }

    if (global) {
      template.global = global;
    }

    if (target) {
      template.target = target;
    }

    if (filters) {
      template.filters = filters;
    }

    await this.templatesRepository.save(template);
  }
}

export default UpdateTemplateService;
