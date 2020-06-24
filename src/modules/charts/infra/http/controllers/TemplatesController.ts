import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateTemplateService from '@modules/charts/services/CreateTemplateService';
import ListTemplateService from '@modules/charts/services/ListTemplateService';
import ShowTemplateService from '@modules/charts/services/ShowTemplateService';
import RemoveTemplateService from '@modules/charts/services/RemoveTemplateService';
import { ObjectID } from 'mongodb';

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
    const { name, global, target, filters } = request.body;

    const createTemplate = container.resolve(CreateTemplateService);

    const template = await createTemplate.execute({
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
}
