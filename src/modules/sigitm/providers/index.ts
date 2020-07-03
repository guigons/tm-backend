import { container } from 'tsyringe';

import '../modules/TAs/providers';
import '../modules/TPs/providers';

import SigitmGruposRepository from '../infra/bridge/repositories/SigitmGruposRepository';
import ISigitmGruposRepository from '../repositories/ISigitmGruposRepository';

import SigitmUsuariosRepository from '../infra/bridge/repositories/SigitmUsuariosRepository';
import ISigitmUsuariosRepository from '../repositories/ISigitmUsuariosRepository';

container.registerSingleton<ISigitmGruposRepository>(
  'SigitmGruposRepository',
  SigitmGruposRepository,
);

container.registerSingleton<ISigitmUsuariosRepository>(
  'SigitmUsuariosRepository',
  SigitmUsuariosRepository,
);
