import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateStampTypeCategoryService from '../../../services/CreateStampTypeCategoryService';
import ListStampCategoriesService from '../../../services/ListStampCategoriesService';
import DeleteStampTypeCategoryService from '../../../services/DeleteStampTypeCategoryService';

export default class StampTypeCategoriesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listStampCategories = container.resolve(ListStampCategoriesService);

    const stampCategories = await listStampCategories.execute();

    return response.json(stampCategories);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { id, name, type_id } = request.body;

    const createStampTypeCategory = container.resolve(
      CreateStampTypeCategoryService,
    );

    const stampTypeCategory = await createStampTypeCategory.execute({
      id,
      name,
      type_id,
    });

    return response.json(stampTypeCategory);
  }

  public async destroy(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.params;

    const deleteStampTypeCategory = container.resolve(
      DeleteStampTypeCategoryService,
    );

    await deleteStampTypeCategory.execute({ id });

    return response.status(204).json();
  }
}
