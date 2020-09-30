import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateTemplateService from '@modules/charts/services/CreateTemplateService';
import ListTemplateService from '@modules/charts/services/ListTemplateService';
import ShowTemplateService from '@modules/charts/services/ShowTemplateService';
import RemoveTemplateService from '@modules/charts/services/RemoveTemplateService';
import { ObjectID } from 'mongodb';
import UpdateTemplateService from '@modules/charts/services/UpdateTemplateService';

export default class TemplatesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const listTemplates = container.resolve(ListTemplateService);

    const templates = await listTemplates.execute({
      user_id,
    });

    return response.json(templates);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { template_id } = request.params;

    const showTemplate = container.resolve(ShowTemplateService);

    const templates = await showTemplate.execute({
      user_id,
      template_id: new ObjectID(template_id),
    });

    return response.json(templates);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { _id, name, global, target, filters } = request.body;

    const createTemplate = container.resolve(CreateTemplateService);

    const template = await createTemplate.execute({
      _id,
      user_id,
      name,
      global,
      target,
      filters,
    });

    return response.json(template);
  }

  public async destroy(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const user_id = request.user.id;
    const { template_id } = request.params;

    const removeTemplate = container.resolve(RemoveTemplateService);

    await removeTemplate.execute({
      user_id,
      template_id: new ObjectID(template_id),
    });

    return response.status(204).json();
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { template_id } = request.params;
    const { name, global, target, filters } = request.body;

    const updateTemplate = container.resolve(UpdateTemplateService);

    await updateTemplate.execute({
      user_id,
      template_id: new ObjectID(template_id),
      name,
      global,
      target,
      filters,
    });

    return response.status(204).json();
  }
}
