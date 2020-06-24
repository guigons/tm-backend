import { MongoRepository, getMongoRepository } from 'typeorm';

import ITemplatesRepository from '@modules/charts/repositories/ITemplatesRepository';

import ICreateTemplateDTO from '@modules/charts/dtos/ICreateTemplateDTO';
import IRemoveTemplateDTO from '@modules/charts/dtos/IRemoveTemplateDTO';
import IFindTemplateDTO from '@modules/charts/dtos/IFindTemplateDTO';
import Template from '../schemas/Template';
import TemplatesFilter from '../schemas/TemplatesFilter';
import TemplatesFilterCondition from '../schemas/TemplatesFilterCondition';

class TemplatesRepository implements ITemplatesRepository {
  private ormRepository: MongoRepository<Template>;

  constructor() {
    this.ormRepository = getMongoRepository(Template, 'tm-mongo');
  }

  public async createTemplate({
    user_id,
    name,
    global,
    target,
    filters,
  }: ICreateTemplateDTO): Promise<Template> {
    const template = this.ormRepository.create({
      user_id,
      name,
      global,
      target,
    });

    // FILTERS
    Object.assign(template, {
      filters: filters.map(f => {
        const filter = new TemplatesFilter();
        Object.assign(filter, {
          conditions: f.conditions.map((c: TemplatesFilterCondition) => {
            const condition = new TemplatesFilterCondition();
            condition.key = c.key;
            condition.operador = c.operador;
            condition.value = c.value;
            return condition;
          }),
        });
        return filter;
      }),
    });

    await this.ormRepository.save(template);
    return template;
  }

  public async findTemplateByUserIdAndId({
    user_id,
    template_id,
  }: IFindTemplateDTO): Promise<Template | undefined> {
    const template = await this.ormRepository.findOne({
      _id: template_id,
      user_id,
    });
    return template;
  }

  public async findTemplatesAndGlobals(user_id: string): Promise<Template[]> {
    const templates = await this.ormRepository.find({ where: { user_id } });
    return templates;
  }

  public async removeTemplate({
    template_id,
  }: IRemoveTemplateDTO): Promise<void> {
    await this.ormRepository.findOneAndDelete({
      _id: template_id,
    });
  }
}

export default TemplatesRepository;
