import { container } from 'tsyringe';
import mailConfig from '@config/mail';
import IMailProvider from './models/IMailProvider';

import EtherealMailProvider from './implementations/EtherealMailProvider';
import VivoMailProvider from './implementations/VivoMailProvider';

function getProvider(driver: string): EtherealMailProvider | VivoMailProvider {
  if (driver === 'ethereal') {
    return container.resolve(EtherealMailProvider);
  }

  return container.resolve(VivoMailProvider);
}

container.registerInstance<IMailProvider>(
  'MailProvider',
  getProvider(mailConfig.driver),
);
