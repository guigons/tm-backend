import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import { celebrate, Segments, Joi } from 'celebrate';
import TAsController from '../controllers/TAsController';

const tasRouter = Router();
const tasController = new TAsController();

// tasRouter.use(ensureAuthenticated);

tasRouter.get('/group', tasController.group);

tasRouter.get(
  '/ids',
  celebrate({
    [Segments.BODY]: {
      ids: Joi.array().items(Joi.number()).required(),
    },
  }),
  tasController.list,
);

tasRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.number().required(),
    },
  }),
  tasController.show,
);

export default tasRouter;
