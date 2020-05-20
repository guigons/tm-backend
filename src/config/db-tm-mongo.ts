import 'dotenv/config';
import { ConnectionOptions } from 'typeorm';

declare let process: {
  env: {
    TM_MONGO_DB_HOSTNAME: string;
    TM_MONGO_DB_USERNAME: string;
    TM_MONGO_DB_PASSWORD: string;
    TM_MONGO_DB_DATABASE: string;
    TM_MONGO_DB_PORT: number;
    TM_MONGO_DB_AUTHSOURCE: string;
  };
};

export const config: ConnectionOptions = {
  name: 'tm-mongo',
  type: 'mongodb',
  host: process.env.TM_MONGO_DB_HOSTNAME,
  port: process.env.TM_MONGO_DB_PORT,
  username: process.env.TM_MONGO_DB_USERNAME,
  password: process.env.TM_MONGO_DB_PASSWORD,
  database: process.env.TM_MONGO_DB_DATABASE,
  authSource: process.env.TM_MONGO_DB_AUTHSOURCE,
  useUnifiedTopology: true,
  entities: [`${__dirname}/../modules/**/infra/typeorm/schemas/*{.ts,.js}`],
};
