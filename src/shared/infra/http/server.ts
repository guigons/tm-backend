import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'express-async-errors';
import AppError from '@shared/errors/AppError';
import routes from './routes';

import '@shared/infra/typeorm';
import '@shared/container';

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.status(200).json({ message: 'HELLO WORLD!' });
});

app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response
      .status(err.statusCode)
      .json({ status: 'error', message: err.message });
  }

  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.listen(process.env.BACKEND_PORT, () => {
  console.log('🚀 Server started on port', process.env.BACKEND_PORT);
});
