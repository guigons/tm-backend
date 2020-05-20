import 'dotenv/config';
import { ConnectionOptions } from 'typeorm';

declare let process: {
  env: {
    TM_DB_HOSTNAME: string;
    TM_DB_USERNAME: string;
    TM_DB_PASSWORD: string;
    TM_DB_DATABASE: string;
    TM_DB_PORT: number;
  };
};

export const config: ConnectionOptions = {
  name: 'tm',
  type: 'postgres',
  host: process.env.TM_DB_HOSTNAME,
  port: process.env.TM_DB_PORT,
  username: process.env.TM_DB_USERNAME,
  password: process.env.TM_DB_PASSWORD,
  database: process.env.TM_DB_DATABASE,
  logging: false,
  entities: [`${__dirname}/../modules/**/infra/typeorm/entities/*{.ts,.js}`],
  migrations: [`${__dirname}/../shared/infra/typeorm/migrations/tm/*{.ts,.js}`],
  cli: {
    migrationsDir: `./src/shared/infra/typeorm/migrations/tm`,
  },
};
