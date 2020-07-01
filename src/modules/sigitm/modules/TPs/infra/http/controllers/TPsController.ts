import { Request, Response } from 'express';
import { container } from 'tsyringe';
import LoadTPsGroupService from '../../../services/LoadTPsGroupService';
import LoadTPsSummaryService from '../../../services/LoadTPsSummaryService';
import LoadTPDetailsService from '../../../services/LoadTPDetailsService';

export default class TasController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    if (!id) response.json([]);

    const loadTPDetails = container.resolve(LoadTPDetailsService);

    const tp = await loadTPDetails.execute({ id: Number(id) });

    return response.json(tp);
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const { ids } = request.body;

    const loadTPsSummary = container.resolve(LoadTPsSummaryService);

    const { tps } = await loadTPsSummary.execute({ ids });

    return response.json(tps);
  }

  public async group(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const loadTPsGroup = container.resolve(LoadTPsGroupService);

    const group = await loadTPsGroup.execute({ user_id });

    return response.json(group);
  }
}
