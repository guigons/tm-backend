import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import StampTypesController from '../controllers/StampTypesController';

const stampTypesRouter = Router();
const stampTypesController = new StampTypesController();

stampTypesRouter.use(ensureAuthenticated);

stampTypesRouter.get('/', stampTypesController.index);

stampTypesRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().uuid().required(),
      name: Joi.string().required(),
      categories: Joi.array().items({
        id: Joi.string().uuid().required(),
        name: Joi.string().required(),
        type_id: Joi.string().uuid(),
        stamps: Joi.array().items({
          id: Joi.string().uuid().required(),
          cod: Joi.string().required(),
          description: Joi.string().required(),
          type_id: Joi.string().uuid(),
          category_id: Joi.string().uuid(),
        }),
      }),
    },
  }),
  stampTypesController.create,
);

stampTypesRouter.delete('/:id', stampTypesController.destroy);

export default stampTypesRouter;
