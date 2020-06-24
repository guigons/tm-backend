import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import UserPreferencesController from '../controllers/UserPreferencesController';

const preferencesRouter = Router();
const userPreferencesController = new UserPreferencesController();

preferencesRouter.use(ensureAuthenticated);

preferencesRouter.get('/', userPreferencesController.show);

preferencesRouter.patch(
  '/',
  celebrate({
    [Segments.BODY]: {
      filas_tas: Joi.array()
        .items(
          Joi.object().keys({
            filaId: Joi.number().required(),
            filaName: Joi.string().required(),
          }),
        )
        .required(),
      filas_tps: Joi.array()
        .items(
          Joi.object().keys({
            filaId: Joi.number().required(),
            filaName: Joi.string().required(),
          }),
        )
        .required(),
      charts: Joi.array()
        .items(
          Joi.object().keys({
            _id: Joi.string().required(),
            template_id: Joi.string().required(),
            name: Joi.string().required(),
            start: Joi.date().required(),
            end: Joi.date().required(),
            horizontal: Joi.string().required(),
            stacked: Joi.boolean().required(),
            type: Joi.string().required(),
            groupBy: Joi.string(),
          }),
        )
        .required(),
    },
  }),
  userPreferencesController.update,
);

export default preferencesRouter;
