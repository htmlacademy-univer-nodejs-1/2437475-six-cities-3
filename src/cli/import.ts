import chalk from 'chalk';
import { createReadStream } from 'node:fs';
import { RentOfferWithUser, RentOffer, User } from '../types/types.js';
import connectToDatabase from '../db/db.js';
import RentOfferModel from '../db/models/rent-offer.js';
import mongoose from 'mongoose';
import logger from '../logger/logger.js';

export async function importData(inputFile: string): Promise<void> {
  try {
    await connectToDatabase();
    const readStream = createReadStream(inputFile, { encoding: 'utf-8' });
    const parsedData: RentOfferWithUser[] = [];
    let currentRow = '';

    readStream.on('data', (chunk: string) => {
      const lines = chunk.split('\n');

      for (let i = 0; i < lines.length - 1; i++) {
        const row = currentRow + lines[i].replace(/^\t/, '');
        parsedData.push(parseTSVRow(row));
      }

      currentRow = lines[lines.length - 1];
    });

    readStream.on('end', async () => {
      if (currentRow.trim().length > 0) {
        parsedData.push(parseTSVRow(currentRow));
      }

      // console.log(chalk.gray(JSON.stringify(parsedData, null, 2)));
      // console.log(chalk.green(`Импортированы данные из файла: ${inputFile}\n`));
      try {
        await RentOfferModel.insertMany(parsedData);
        logger.info(chalk.green('The data has been successfully imported into the database.'));
      } catch (error) {
        logger.warn(chalk.red(`Error when saving data to the database: ${(error as Error).message}`));
      }

      await mongoose.disconnect();
    });

    readStream.on('error', (error: Error) => {
      logger.warn(chalk.red(`Error when importing data: ${(error as Error).message}`));
    });
  } catch (error) {
    logger.warn(chalk.red(`Error opening the file: ${(error as Error).message}`));
  }
}

function parseTSVRow(row: string): RentOfferWithUser {
  const fields = row.split('\t');
  const cleanedFields = fields.map((field) => field.replace(/^"|"$/g, ''));

  const [
    name,
    description,
    publishedAt,
    city,
    previewImage,
    images,
    premium,
    favorite,
    rating,
    type,
    rooms,
    guests,
    price,
    features,
    userId,
    userName,
    userEmail,
    avatar,
    password,
    userType,
    latitude,
    longitude
  ] = cleanedFields;

  return {
    name,
    description,
    publishedAt: new Date(publishedAt),
    city: city as RentOffer['city'],
    previewImage,
    images: images.split(';'),
    premium: Boolean(premium),
    favorite: Boolean(favorite),
    rating: Number(rating),
    type: type as RentOffer['type'],
    rooms: Number(rooms),
    guests: Number(guests),
    price: Number(price),
    features: features.split(';'),
    rentOfferUser: {
      id: userId,
      name: userName,
      email: userEmail,
      avatar: avatar || undefined,
      password,
      type: userType as User['type']
    },
    coordinates: {
      latitude: Number(latitude),
      longitude: Number(longitude)
    }
  } as RentOfferWithUser;
}
