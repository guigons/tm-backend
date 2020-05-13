import { Router } from 'express';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import tasRouter from '@modules/TAs/infra/http/routes/tas.routes';
import tpsRouter from '@modules/TPs/infra/http/routes/tps.routes';

const routes = Router();
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/password', passwordRouter);
routes.use('/tas', tasRouter);
routes.use('/tps', tpsRouter);

export default routes;
