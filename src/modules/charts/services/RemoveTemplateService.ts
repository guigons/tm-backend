import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { injectable, inject } from 'tsyringe';
import ITemplatesRepository from '@modules/charts/repositories/ITemplatesRepository';
import { ObjectId } from 'mongodb';

interface IRequest {
  user_id: string;
  template_id: ObjectId;
}

@injectable()
class RemoveTemplateService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('TemplatesRepository')
    private templatesRepository: ITemplatesRepository,
  ) {}

  public async execute({ user_id, template_id }: IRequest): Promise<void> {
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

    await this.templatesRepository.removeTemplate({ user_id, template_id });
  }
}

export default RemoveTemplateService;
