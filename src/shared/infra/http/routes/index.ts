import { Router } from 'express';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import tasRouter from '@modules/sigitm/infra/http/routes/tas.routes';

const routes = Router();
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/tas', tasRouter);

export default routes;
