interface IMailConfig {
  driver: 'ethereal' | 'vivo';
}

export default {
  driver: process.env.MAIL_DRIVER || 'vivo',
} as IMailConfig;
