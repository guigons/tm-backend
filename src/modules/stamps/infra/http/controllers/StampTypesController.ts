import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateStampTypeService from '../../../services/CreateStampTypeService';

export default class StampTypesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name } = request.body;

    const createStampType = container.resolve(CreateStampTypeService);

    const stampType = await createStampType.execute({
      name,
    });

    return response.json(stampType);
  }
}
