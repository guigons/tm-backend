import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import SigitmTAsRepository from '@modules/sigitm/infra/typeorm/repositories/SigitmTAsRepository';
import ISigitmTAsRepository from '@modules/sigitm/repositories/ISigitmTAsRepository';

import { container } from 'tsyringe';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<ISigitmTAsRepository>(
  'SigitmTAsRepository',
  SigitmTAsRepository,
);
