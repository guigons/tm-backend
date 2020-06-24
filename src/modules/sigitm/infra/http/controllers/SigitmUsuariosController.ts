import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ShowSigitmUsuariosService from '@modules/sigitm/services/ShowSigitmUsuariosService';

export default class SigitmUsuariosController {
  public async index(request: Request, response: Response): Promise<Response> {
    const showSigitmUsuarios = container.resolve(ShowSigitmUsuariosService);

    const sigitmUsuarios = await showSigitmUsuarios.execute();

    return response.json(sigitmUsuarios);
  }
}
