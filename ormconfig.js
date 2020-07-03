const dbTM = require('./src/config/db-tm');
const dbTMMongo = require('./src/config/db-tm-mongo');
module.exports = [dbTM.config, dbTMMongo.config];
