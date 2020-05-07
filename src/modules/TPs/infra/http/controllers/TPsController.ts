import { Request, Response } from 'express';
import { container } from 'tsyringe';
import LoadTPDetailsService from '@modules/TPs/services/LoadTPDetailsService';
import LoadTPsGroupService from '@modules/TPs/services/LoadTPsGroupService';
import LoadTPsSummaryService from '@modules/TPs/services/LoadTPsSummaryService';

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
    const loadTPsGroup = container.resolve(LoadTPsGroupService);

    const group = await loadTPsGroup.execute();

    return response.json(group);
  }
}
