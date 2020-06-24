import { Router } from 'express';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import { celebrate, Segments, Joi } from 'celebrate';
import TPsController from '../controllers/TPsController';

const tpsRouter = Router();
const tpsController = new TPsController();

tpsRouter.use(ensureAuthenticated);

tpsRouter.get('/group', tpsController.group);

tpsRouter.get(
  '/ids',
  celebrate({
    [Segments.BODY]: {
      ids: Joi.array().items(Joi.number()).required(),
    },
  }),
  tpsController.list,
);

tpsRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.number().required(),
    },
  }),
  tpsController.show,
);

export default tpsRouter;
