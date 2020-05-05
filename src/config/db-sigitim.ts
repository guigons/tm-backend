import { ConnectionOptions } from 'typeorm';

require('dotenv').config();

declare let process: {
  env: {
    SIGITM_DB_HOSTNAME: string;
    SIGITM_DB_USERNAME: string;
    SIGITM_DB_PASSWORD: string;
    SIGITM_DB_SID: string;
    SIGITM_DB_PORT: number;
  };
};

export const config: ConnectionOptions = {
  name: 'sigitm',
  type: 'oracle',
  host: process.env.SIGITM_DB_HOSTNAME,
  username: process.env.SIGITM_DB_USERNAME,
  password: process.env.SIGITM_DB_PASSWORD,
  port: process.env.SIGITM_DB_PORT,
  sid: process.env.SIGITM_DB_SID,
  synchronize: false,
  logging: true,
  entities: [`${__dirname}/../modules/**/infra/typeorm/entities/**/*{.ts,.js}`],
  migrations: [
    `${__dirname}/../shared/infra/typeorm/migrations/sigitm/*{.ts,.js}`,
  ],
  cli: {
    migrationsDir: `./src/shared/infra/typeorm/migration/sigitm`,
  },
};
