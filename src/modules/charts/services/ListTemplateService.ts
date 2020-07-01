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
    const templatesSorted = templates.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

    return templatesSorted;
  }
}

export default ListTemplatesService;
