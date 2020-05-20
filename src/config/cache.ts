import { RedisOptions } from 'ioredis';

interface ICacheConfig {
  driver: 'redis';

  config: {
    redis: RedisOptions | undefined;
  };
}

export default {
  driver: process.env.CACHE_DRIVER || 'redis',
  config: {
    redis: {
      host: process.env.REDIS_DB_HOSTNAME,
      port: process.env.REDIS_DB_PORT,
      password: process.env.REDIS_DB_PASSWORD || undefined,
    },
  },
} as ICacheConfig;
