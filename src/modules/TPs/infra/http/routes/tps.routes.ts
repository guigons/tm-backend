import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import TPsController from '../controllers/TPsController';

const tpsRouter = Router();
const tpsController = new TPsController();

// tpsRouter.use(ensureAuthenticated);

tpsRouter.get('/group', tpsController.group);

tpsRouter.get('/ids', tpsController.list);

tpsRouter.get('/:id', tpsController.show);

export default tpsRouter;
