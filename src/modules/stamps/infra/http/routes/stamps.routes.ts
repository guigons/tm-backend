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
      cod: Joi.string().required(),
      description: Joi.string().required(),
      type_id: Joi.string().uuid().required(),
      category_id: Joi.string().uuid().required(),
    },
  }),
  stampsController.create,
);

export default stampsRouter;
