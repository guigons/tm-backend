import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import StampsController from '../controllers/StampsController';

const stampsRouter = Router();
const stampsController = new StampsController();

stampsRouter.use(ensureAuthenticated);

stampsRouter.get('/', stampsController.index);

stampsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().uuid().required(),
      type_id: Joi.string().uuid().required(),
      category_id: Joi.string().uuid().required(),
      cod: Joi.string().required(),
      description: Joi.string().required(),
    },
  }),
  stampsController.create,
);

stampsRouter.patch(
  '/:id',
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().uuid(),
      type_id: Joi.string().uuid(),
      category_id: Joi.string().uuid(),
      cod: Joi.string(),
      description: Joi.string(),
      created_at: Joi.string(),
      updated_at: Joi.string(),
    },
  }),
  stampsController.update,
);

stampsRouter.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  stampsController.destroy,
);

export default stampsRouter;
