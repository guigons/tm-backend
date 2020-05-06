import { Request, Response } from 'express';
import { container } from 'tsyringe';
import LoadTADetailsService from '@modules/TAs/services/LoadTADetailsService';
import LoadTAsGroupService from '@modules/TAs/services/LoadTAsGroupService';
import LoadTAsSummaryService from '@modules/TAs/services/LoadTAsSummaryService';

export default class TasController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    if (!id) response.json([]);

    const loadTADetails = container.resolve(LoadTADetailsService);

    const ta = await loadTADetails.execute({ id: Number(id) });

    return response.json(ta);
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const { ids } = request.body;

    const loadTAsSummary = container.resolve(LoadTAsSummaryService);

    const { tas } = await loadTAsSummary.execute({ ids });

    return response.json(tas);
  }

  public async group(request: Request, response: Response): Promise<Response> {
    const loadTAsGroup = container.resolve(LoadTAsGroupService);

    const group = await loadTAsGroup.execute();

    return response.json(group);
  }
}
