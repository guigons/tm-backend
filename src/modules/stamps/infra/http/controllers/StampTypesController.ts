import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateStampTypeService from '../../../services/CreateStampTypeService';
import ListStampTypesService from '../../../services/ListStampTypesService';
import DeleteStampTypeService from '../../../services/DeleteStampTypeService';
import UpdateStampTypeService from '../../../services/UpdateStampTypeService';

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

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { name } = request.body;

    const updateStampType = container.resolve(UpdateStampTypeService);

    const stampType = await updateStampType.execute({
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

    const deleteStampType = container.resolve(DeleteStampTypeService);

    await deleteStampType.execute({ id });

    return response.status(204).json();
  }
}
