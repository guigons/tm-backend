import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateStampCategoryService from '../../../services/CreateStampCategoryService';
import ListStampCategoriesService from '../../../services/ListStampCategoriesService';
import DeleteStampCategoryService from '../../../services/DeleteStampCategoryService';
import UpdateStampCategoryService from '../../../services/UpdateStampCategoryService';

export default class StampCategoriesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listStampCategories = container.resolve(ListStampCategoriesService);

    const stampCategories = await listStampCategories.execute();

    return response.json(stampCategories);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { id, name, type_id } = request.body;

    const createStampCategory = container.resolve(CreateStampCategoryService);

    const stampCategory = await createStampCategory.execute({
      id,
      name,
      type_id,
    });

    return response.json(stampCategory);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { name } = request.body;

    const updateStampCategory = container.resolve(UpdateStampCategoryService);

    const stampCategory = await updateStampCategory.execute({
      id,
      name,
    });

    return response.json(stampCategory);
  }

  public async destroy(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.params;

    const deleteStampCategory = container.resolve(DeleteStampCategoryService);

    await deleteStampCategory.execute({ id });

    return response.status(204).json();
  }
}
