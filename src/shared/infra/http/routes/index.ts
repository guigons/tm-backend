import { Router } from 'express';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import userPreferencesRouter from '@modules/users/infra/http/routes/userPreferences.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import templatesRouter from '@modules/charts/infra/http/routes/templates.routes';
import chartsRouter from '@modules/charts/infra/http/routes/charts.routes';
import sigitmRouter from '@modules/sigitm/infra/http/routes/sigitm.routes';
import stampTypesRouter from '@modules/sigitm/modules/stamps/infra/http/routes/stampTypes.routes';
import stampsRouter from '@modules/sigitm/modules/stamps/infra/http/routes/stamps.routes';
import tasRouter from '@modules/sigitm/modules/TAs/infra/http/routes/tas.routes';
import tpsRouter from '@modules/sigitm/modules/TPs/infra/http/routes/tps.routes';

const routes = Router();
routes.use('/users', usersRouter);
routes.use('/userPreferences', userPreferencesRouter);
routes.use('/profile', profileRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/password', passwordRouter);
routes.use('/templates', templatesRouter);
routes.use('/charts', chartsRouter);
routes.use('/sigitm', sigitmRouter);
routes.use('/stampTypes', stampTypesRouter);
routes.use('/stamps', stampsRouter);
routes.use('/tas', tasRouter);
routes.use('/tps', tpsRouter);

export default routes;
