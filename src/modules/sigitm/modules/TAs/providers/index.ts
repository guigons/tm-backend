import { container } from 'tsyringe';

import TAsRepository from '@modules/sigitm/modules/TAs/infra/bridge/repositories/TAsRepository';
import ITAsRepository from '@modules/sigitm/modules/TAs/repositories/ITAsRepository';

container.registerSingleton<ITAsRepository>('TAsRepository', TAsRepository);
