import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateStampTypeCategoryService from '../../../services/CreateStampTypeCategoryService';

export default class StampTypeCategoriesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name } = request.body;
    const { idType: type_id } = request.params;

    const createStampTypeCategory = container.resolve(
      CreateStampTypeCategoryService,
    );

    const stampTypeCategory = await createStampTypeCategory.execute({
      name,
      type_id,
    });

    return response.json(stampTypeCategory);
  }
}
