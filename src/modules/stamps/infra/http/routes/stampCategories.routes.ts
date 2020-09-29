import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import StampCategoriesController from '../controllers/StampCategoriesController';

const stampCategoriesRouter = Router();
const stampCategoriesController = new StampCategoriesController();

stampCategoriesRouter.use(ensureAuthenticated);

stampCategoriesRouter.get('/', stampCategoriesController.index);

stampCategoriesRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().uuid().required(),
      name: Joi.string().required(),
      type_id: Joi.string().uuid().required(),
      stamps: Joi.array().items({
        id: Joi.string().uuid().required(),
        cod: Joi.string().required(),
        description: Joi.string().required(),
        type_id: Joi.string().uuid(),
        category_id: Joi.string().uuid(),
      }),
    },
  }),
  stampCategoriesController.create,
);

stampCategoriesRouter.patch(
  '/:id',
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().uuid().required(),
      name: Joi.string().required(),
      type_id: Joi.string().uuid().required(),
      stamps: Joi.array().items({
        id: Joi.string().uuid(),
        cod: Joi.string().allow('', null),
        description: Joi.string().allow('', null),
        type_id: Joi.string().uuid(),
        category_id: Joi.string().uuid(),
        created_at: Joi.string(),
        updated_at: Joi.string(),
      }),
      created_at: Joi.string(),
      updated_at: Joi.string(),
    },
  }),
  stampCategoriesController.update,
);

stampCategoriesRouter.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  stampCategoriesController.destroy,
);

export default stampCategoriesRouter;
