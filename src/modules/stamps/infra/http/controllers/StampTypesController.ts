import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateStampTypeService from '../../../services/CreateStampTypeService';
import ListStampTypesService from '../../../services/ListStampTypesService';
import DeleteStampService from '../../../services/DeleteStampService';

export default class StampTypesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listStampTypes = container.resolve(ListStampTypesService);

    const stampTypes = await listStampTypes.execute();

    return response.json(stampTypes);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { id, name } = request.body;

    const createStampType = container.resolve(CreateStampTypeService);

    const stampType = await createStampType.execute({
      id,
      name,
    });

    return response.json(stampType);
  }

  public async destroy(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.params;

    const deleteStamp = container.resolve(DeleteStampService);

    await deleteStamp.execute({ id });

    return response.status(204).json();
  }
}
