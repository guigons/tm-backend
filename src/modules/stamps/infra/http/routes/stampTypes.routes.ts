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

stampTypesRouter.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  stampTypesController.destroy,
);

stampTypesRouter.patch(
  '/:template_id',
  celebrate({
    [Segments.PARAMS]: {
      template_id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      id: Joi.string().uuid(),
      name: Joi.string().allow('', null),
      categories: Joi.array().items({
        id: Joi.string().uuid(),
        name: Joi.string().allow('', null),
        type_id: Joi.string().uuid(),
        stamps: Joi.array().items({
          id: Joi.string().uuid(),
          cod: Joi.string().allow('', null),
          description: Joi.string().allow('', null),
          type_id: Joi.string().uuid(),
          category_id: Joi.string().uuid(),
        }),
      }),
    },
  }),
  stampTypesController.update,
);

export default stampTypesRouter;
