import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import TAsRepository from '@modules/TAs/infra/typeorm/repositories/TAsRepository';
import ITAsRepository from '@modules/TAs/repositories/ITAsRepository';

import TPsRepository from '@modules/TPs/infra/typeorm/repositories/TPsRepository';
import ITPsRepository from '@modules/TPs/repositories/ITPsRepository';

import { container } from 'tsyringe';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<ITAsRepository>('TAsRepository', TAsRepository);

container.registerSingleton<ITPsRepository>('TPsRepository', TPsRepository);
