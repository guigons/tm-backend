const dbSigitm = require('./src/config/db-sigitim');
const dbTM = require('./src/config/db-tm');
const dbTMMongo = require('./src/config/db-tm-mongo');
module.exports = [dbSigitm.config, dbTM.config, dbTMMongo.config];
