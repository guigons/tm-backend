import { container } from 'tsyringe';
import mailConfig from '@config/mail';
import IMailProvider from './models/IMailProvider';

import EtherealMailProvider from './implementations/EtherealMailProvider';
import VivoMailProvider from './implementations/VivoMailProvider';

const providers = {
  ethereal: container.resolve(EtherealMailProvider),
  vivo: container.resolve(VivoMailProvider),
};

container.registerInstance<IMailProvider>(
  'MailProvider',
  providers[mailConfig.driver],
);
