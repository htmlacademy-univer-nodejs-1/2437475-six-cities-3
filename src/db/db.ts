import mongoose from 'mongoose';
import logger from '../logger/logger.js';
import dotenv from 'dotenv';

async function connectToDatabase() {
  dotenv.config();
  const dbUri = process.env.DB_HOST || 'mongodb://127.0.0.1:27017/';

  try {
    await mongoose.connect(dbUri);
    mongoose.connection.on('connected', () => {
      logger.info('MongoDB connected');
    });
    logger.info('Connect db success in ', dbUri);
    mongoose.connection.on('error', (error) => {
      logger.error('MongoDB connection error', error);
    });

    mongoose.connection.on('disconnected', () => {
      logger.info('MongoDB disconnected');
    });
  } catch (error) {
    logger.error('Error connect DataBase', error);
  }
}

export default connectToDatabase;
