import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import TemplatesController from '../controllers/TemplatesController';

const templatesRouter = Router();
const templatesController = new TemplatesController();

templatesRouter.use(ensureAuthenticated);

templatesRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      global: Joi.boolean(),
      target: Joi.string().required(),
      filters: Joi.array()
        .items({
          conditions: Joi.array()
            .items(
              Joi.object().keys({
                key: Joi.string().required(),
                operador: Joi.string().required(),
                value: Joi.string().allow('').required(),
              }),
            )
            .required(),
        })
        .required(),
    },
  }),
  templatesController.create,
);

templatesRouter.get('/', templatesController.index);

templatesRouter.get(
  '/:template_id',
  celebrate({
    [Segments.PARAMS]: {
      template_id: Joi.string().required(),
    },
  }),
  templatesController.show,
);

templatesRouter.delete(
  '/:template_id',
  celebrate({
    [Segments.PARAMS]: {
      template_id: Joi.string().required(),
    },
  }),
  templatesController.destroy,
);

export default templatesRouter;
