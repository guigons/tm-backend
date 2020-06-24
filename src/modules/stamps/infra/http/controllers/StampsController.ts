import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListStampsService from '../../../services/ListStampsService';
import CreateStampService from '../../../services/CreateStampService';

export default class StampsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listStamps = container.resolve(ListStampsService);

    const stamps = await listStamps.execute();

    return response.json(stamps);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { cod, description, type_id, category_id } = request.body;

    const createStamp = container.resolve(CreateStampService);

    const stamp = await createStamp.execute({
      cod,
      description,
      type_id,
      category_id,
    });

    return response.json(stamp);
  }
}
