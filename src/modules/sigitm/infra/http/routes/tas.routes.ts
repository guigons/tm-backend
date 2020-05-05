import { Router } from 'express';
import SigitmTARepository from '@modules/sigitm/infra/typeorm/repositories/SigitmTARepository';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const tasRouter = Router();

tasRouter.use(ensureAuthenticated);

tasRouter.get('/table', async (request, response) => {
  const sigitmTARepository = new SigitmTARepository();
  const table = await sigitmTARepository.findTable();

  return response.json(table);
});

tasRouter.get('/ids', async (request, response) => {
  const { ids } = request.body;

  if (!ids) response.json([]);

  const sigitmTARepository = new SigitmTARepository();
  const table = await sigitmTARepository.findByIds(ids, {
    relations: ['responsavel', 'fila', 'criador', 'grupoCriador'],
  });

  return response.json(table);
});

tasRouter.get('/:id', async (request, response) => {
  const { id } = request.params;

  if (!id) response.json([]);

  const sigitmTARepository = new SigitmTARepository();
  const table = await sigitmTARepository.findOne(id, {
    relations: [
      'responsavel',
      'fila',
      'criador',
      'grupoCriador',
      'status',
      'rede',
      'rede.tipo',
      'dadosIP',
      'baixa',
      'historicos',
      'historicos.usuario',
      'historicos.grupo',
    ],
  });

  return response.json(table);
});

export default tasRouter;
