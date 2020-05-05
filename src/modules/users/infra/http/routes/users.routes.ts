import { Router } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '@modules/users/services/CreateUserService';

const usersRouter = Router();

usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;

  const createUser = container.resolve(CreateUserService);

  const user = await createUser.execute({
    name,
    email,
    password,
  });

  delete user.password;
  return response.json(user);
});

export default usersRouter;
