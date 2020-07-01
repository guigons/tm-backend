import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import StampTypesController from '../controllers/StampTypesController';
import StampTypeCategoriesController from '../controllers/StampTypeCategoriesController';

const stampTypesRouter = Router();
const stampTypesController = new StampTypesController();
const stampTypeCategoriesController = new StampTypeCategoriesController();

stampTypesRouter.use(ensureAuthenticated);

stampTypesRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
    },
  }),
  stampTypesController.create,
);

stampTypesRouter.post(
  '/:idType/categories',
  celebrate({
    [Segments.PARAMS]: {
      idType: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      name: Joi.string().required(),
    },
  }),
  stampTypeCategoriesController.create,
);

export default stampTypesRouter;
