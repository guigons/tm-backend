import 'dotenv/config';
import { createConnection } from 'typeorm';

createConnection('sigitm');
createConnection('tm');
createConnection('tm-mongo');
