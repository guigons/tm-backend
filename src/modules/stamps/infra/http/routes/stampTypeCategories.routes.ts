import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import StampTypeCategoriesController from '../controllers/StampTypeCategoriesController';

const stampTypeCategoriesRouter = Router();
const stampTypeCategoriesController = new StampTypeCategoriesController();

stampTypeCategoriesRouter.use(ensureAuthenticated);

stampTypeCategoriesRouter.get('/', stampTypeCategoriesController.index);

stampTypeCategoriesRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().uuid().required(),
      name: Joi.string().required(),
      type_id: Joi.string().uuid().required(),
    },
  }),
  stampTypeCategoriesController.create,
);

stampTypeCategoriesRouter.delete('/:id', stampTypeCategoriesController.destroy);

export default stampTypeCategoriesRouter;
