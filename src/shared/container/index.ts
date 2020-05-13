import { container } from 'tsyringe';

import '@modules/users/providers';
import './providers';

import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

import TAsRepository from '@modules/TAs/infra/typeorm/repositories/TAsRepository';
import ITAsRepository from '@modules/TAs/repositories/ITAsRepository';

import TPsRepository from '@modules/TPs/infra/typeorm/repositories/TPsRepository';
import ITPsRepository from '@modules/TPs/repositories/ITPsRepository';

import NotificationsRepository from '@modules/notifications/infra/typeorm/repositories/NotificationsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);

container.registerSingleton<INotificationsRepository>(
  'NotificationsRepository',
  NotificationsRepository,
);

container.registerSingleton<ITAsRepository>('TAsRepository', TAsRepository);

container.registerSingleton<ITPsRepository>('TPsRepository', TPsRepository);
