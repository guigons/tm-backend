import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ChartsController from '../controllers/ChartsController';

const chartsRouter = Router();
const chartsController = new ChartsController();

chartsRouter.use(ensureAuthenticated);

chartsRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      template_id: Joi.string().required(),
      chartPreference_id: Joi.string().required(),
    },
  }),
  chartsController.show,
);

export default chartsRouter;
