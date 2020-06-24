import { container } from 'tsyringe';

import './HashProvider';

import UsersRepository from '../infra/typeorm/repositories/UsersRepository';
import IUsersRepository from '../repositories/IUsersRepository';

import UserTokensRepository from '../infra/typeorm/repositories/UserTokensRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

import UserPreferencesRepository from '../infra/typeorm/repositories/UserPreferencesRepository';
import IUserPreferencesRepository from '../repositories/IUserPreferencesRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);

container.registerSingleton<IUserPreferencesRepository>(
  'UserPreferencesRepository',
  UserPreferencesRepository,
);
