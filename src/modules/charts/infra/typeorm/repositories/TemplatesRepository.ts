import { MongoRepository, getMongoRepository } from 'typeorm';

import ITemplatesRepository from '@modules/charts/repositories/ITemplatesRepository';

import IRemoveTemplateDTO from '@modules/charts/dtos/IRemoveTemplateDTO';
import IFindTemplateDTO from '@modules/charts/dtos/IFindTemplateDTO';
import { ObjectId, ObjectID } from 'mongodb';

import Template from '../schemas/Template';

class TemplatesRepository implements ITemplatesRepository {
  private ormRepository: MongoRepository<Template>;

  constructor() {
    this.ormRepository = getMongoRepository(Template, 'tm-mongo');
  }

  public async create(template: Template): Promise<Template> {
    Object.assign(template, {
      filters: template.filters.map(f => ({
        ...f,
        _id: new ObjectId(f._id),
        conditions: f.conditions.map(c => ({ ...c, _id: new ObjectId(c._id) })),
      })),
    });

    await this.ormRepository.insertOne(template);
    return template;
  }

  public async save(template: Template): Promise<Template> {
    Object.assign(template, {
      filters: template.filters.map(f => ({
        ...f,
        _id: new ObjectId(f._id),
        conditions: f.conditions.map(c => ({ ...c, _id: new ObjectId(c._id) })),
      })),
    });
    await this.ormRepository.update(
      { _id: new ObjectId(template._id) },
      template,
    );
    return template;
  }

  public async findTemplateByUserIdAndId({
    user_id,
    template_id,
  }: IFindTemplateDTO): Promise<Template | undefined> {
    const template = await this.ormRepository.findOne({
      where: {
        $or: [
          {
            _id: new ObjectID(template_id),
            user_id,
          },
          {
            _id: new ObjectID(template_id),
            global: true,
          },
        ],
      },
    });
    return template;
  }

  public async findTemplatesAndGlobals(user_id: string): Promise<Template[]> {
    const templates = await this.ormRepository.find({
      where: {
        $or: [
          {
            user_id,
          },
          {
            global: true,
          },
        ],
      },
    });
    return templates;
  }

  public async removeTemplate({
    template_id,
  }: IRemoveTemplateDTO): Promise<void> {
    await this.ormRepository.findOneAndDelete({
      _id: new ObjectID(template_id),
    });
  }
}

export default TemplatesRepository;
