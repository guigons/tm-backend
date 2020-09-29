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
      _id: Joi.string(),
      name: Joi.string().required(),
      global: Joi.boolean(),
      target: Joi.string().required(),
      filters: Joi.array()
        .items({
          _id: Joi.string(),
          conditions: Joi.array()
            .items(
              Joi.object().keys({
                _id: Joi.string(),
                filterId: Joi.string(),
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

templatesRouter.patch(
  '/:template_id',
  celebrate({
    [Segments.BODY]: {
      _id: Joi.string(),
      name: Joi.string(),
      global: Joi.boolean(),
      target: Joi.string(),
      filters: Joi.array().items({
        _id: Joi.string(),
        conditions: Joi.array().items(
          Joi.object().keys({
            _id: Joi.string(),
            filterId: Joi.string(),
            key: Joi.string(),
            operador: Joi.string(),
            value: Joi.string().allow(''),
          }),
        ),
      }),
    },
    [Segments.PARAMS]: {
      template_id: Joi.string().required(),
    },
  }),
  templatesController.update,
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
