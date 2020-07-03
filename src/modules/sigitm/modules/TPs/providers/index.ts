import { container } from 'tsyringe';

import TPsRepository from '@modules/sigitm/modules/TPs/infra/bridge/repositories/TPsRepository';
import ITPsRepository from '@modules/sigitm/modules/TPs/repositories/ITPsRepository';

container.registerSingleton<ITPsRepository>('TPsRepository', TPsRepository);
