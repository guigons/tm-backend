import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ShowSigitmGruposService from '@modules/sigitm/services/ShowSigitmGruposService';

export default class SigitmGruposController {
  public async index(request: Request, response: Response): Promise<Response> {
    const showSigitmGrupos = container.resolve(ShowSigitmGruposService);

    const sigitmGrupos = await showSigitmGrupos.execute();

    return response.json(sigitmGrupos);
  }
}
