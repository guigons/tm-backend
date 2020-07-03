import 'dotenv/config';
import { createConnection } from 'typeorm';

createConnection('tm');
createConnection('tm-mongo');
