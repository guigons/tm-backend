import { container } from 'tsyringe';

import StampTypesRepository from '../infra/typeorm/repositories/StampTypesRepository';
import IStampTypesRepository from '../repositories/IStampTypesRepository';

import StampCategoriesRepository from '../infra/typeorm/repositories/StampCategoriesRepository';
import IStampCategoriesRepository from '../repositories/IStampCategoriesRepository';

import StampsRepository from '../infra/typeorm/repositories/StampsRepository';
import IStampsRepository from '../repositories/IStampsRepository';

container.registerSingleton<IStampTypesRepository>(
  'StampTypesRepository',
  StampTypesRepository,
);

container.registerSingleton<IStampCategoriesRepository>(
  'StampCategoriesRepository',
  StampCategoriesRepository,
);

container.registerSingleton<IStampsRepository>(
  'StampsRepository',
  StampsRepository,
);
