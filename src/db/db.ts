import mongoose from 'mongoose';
import logger from '../logger/logger.js';

async function connectToDatabase() {
  const dbUri = process.env.dbhost || 'mongodb://127.0.0.1:27017/';

  try {
    await mongoose.connect(dbUri);
    logger.info('Connect db success in ', dbUri);
  } catch (error) {
    logger.error('Error connect DataBase', error);
  }
}

export default connectToDatabase;
