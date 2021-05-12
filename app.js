// mongoresotre --db=izzi --archive=./ozzo.gzip --gzip
require('dotenv').config();
const path = require('path');
const cron = require('node-cron');
const backupMongoDB = require('./src/services/mongoDump.services');

const ARCHIVE_PATH = path.join(__dirname, 'public', `${process.env.DB_DATABASE}.gzip`);

cron.schedule('0 */8 * * *', () => backupMongoDB(ARCHIVE_PATH));
