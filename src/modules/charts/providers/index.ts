import { container } from 'tsyringe';

import TemplatesRepository from '@modules/charts/infra/typeorm/repositories/TemplatesRepository';
import ITemplatesRepository from '@modules/charts/repositories/ITemplatesRepository';

container.registerSingleton<ITemplatesRepository>(
  'TemplatesRepository',
  TemplatesRepository,
);
