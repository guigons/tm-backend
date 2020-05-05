import { createConnection } from 'typeorm';

require('dotenv').config();

createConnection('sigitm');
createConnection('tm');
