import AppError from '@shared/errors/AppError';
import { Request, Response, NextFunction } from 'express';
import redis from 'redis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

const redisClient = redis.createClient({
  host: process.env.REDIS_DB_HOSTNAME,
  port: Number(process.env.REDIS_DB_PORT),
  password: process.env.REDIS_DB_PASSWORD || undefined,
});

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'ratelimit',
  points: 20,
  duration: 1,
});

export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await limiter.consume(request.ip);
    return next();
  } catch (error) {
    throw new AppError('Too many requests', 429);
  }
}
