// import importDir from 'import-dir';

import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

import config from './configs';
// connect mongodb
const mongoLink = config.mongodb.url;
const mongoOptions = config.mongodb.options;
mongoose.connect(mongoLink, mongoOptions);

mongoose.connection.on('error', console.error);

// 导入model层
// const models = importDir('./models');

export default mongoose;
