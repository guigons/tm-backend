import { container } from 'tsyringe';

import IHashProvider from './models/IHashProviders';
import BCryptHashProvider from './implementations/BCryptHashProvider';

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);
