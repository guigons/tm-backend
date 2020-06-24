import { injectable, inject } from 'tsyringe';
import ITemplatesRepository from '@modules/charts/repositories/ITemplatesRepository';
import Template from '@modules/charts/infra/typeorm/schemas/Template';

interface IRequest {
  user_id: string;
}

@injectable()
class ListTemplatesService {
  constructor(
    @inject('TemplatesRepository')
    private templatesRepository: ITemplatesRepository,
  ) {}

  public async execute({ user_id }: IRequest): Promise<Template[]> {
    const templates = await this.templatesRepository.findTemplatesAndGlobals(
      user_id,
    );

    return templates;
  }
}

export default ListTemplatesService;
