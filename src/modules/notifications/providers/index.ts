import { container } from 'tsyringe';

import NotificationsRepository from '../infra/typeorm/repositories/NotificationsRepository';
import INotificationsRepository from '../repositories/INotificationsRepository';

container.registerSingleton<INotificationsRepository>(
  'NotificationsRepository',
  NotificationsRepository,
);
