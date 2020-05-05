import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import TasController from '../controllers/TasController';

const tasRouter = Router();
const tasController = new TasController();

tasRouter.use(ensureAuthenticated);

tasRouter.get('/group', tasController.group);

tasRouter.get('/ids', tasController.list);

tasRouter.get('/:id', tasController.show);

export default tasRouter;
