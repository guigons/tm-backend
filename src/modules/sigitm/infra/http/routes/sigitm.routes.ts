import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import SigitmGruposController from '../controllers/SigitmGruposController';
import SigitmUsuariosController from '../controllers/SigitmUsuariosController';

const sigitmRouter = Router();
const sigitmGruposController = new SigitmGruposController();
const sigitmUsuariosController = new SigitmUsuariosController();

sigitmRouter.use(ensureAuthenticated);

sigitmRouter.get('/grupos', sigitmGruposController.index);
sigitmRouter.get('/usuarios', sigitmUsuariosController.index);

export default sigitmRouter;
