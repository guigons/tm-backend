import { container } from 'tsyringe';

import StampTypesRepository from '../infra/typeorm/repositories/StampTypesRepository';
import IStampTypesRepository from '../repositories/IStampTypesRepository';

import StampTypeCategoriesRepository from '../infra/typeorm/repositories/StampTypeCategoriesRepository';
import IStampTypeCategoriesRepository from '../repositories/IStampTypeCategoriesRepository';

import StampsRepository from '../infra/typeorm/repositories/StampsRepository';
import IStampsRepository from '../repositories/IStampsRepository';

container.registerSingleton<IStampTypesRepository>(
  'StampTypesRepository',
  StampTypesRepository,
);

container.registerSingleton<IStampTypeCategoriesRepository>(
  'StampTypeCategoriesRepository',
  StampTypeCategoriesRepository,
);

container.registerSingleton<IStampsRepository>(
  'StampsRepository',
  StampsRepository,
);
