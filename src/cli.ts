#!/usr/bin/env node

import chalk from 'chalk';
import fs from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { RentOffer } from '../types.js';
import { User } from '../types.js';
import { RentOfferWithUser } from '../types.js';

/* npm run cli -- help
npm run cli -- generate 30 ./mocks/test_data.tsv http://localhost:3000/
npm run cli -- import ./mocks/test_data.tsv
*/

interface PackageJson {
  version: string;
}

async function importData(inputFile: string): Promise<void> {
  try {
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

    readStream.on('end', () => {
      if (currentRow.trim().length > 0) {
        parsedData.push(parseTSVRow(currentRow));
      }

      console.log(chalk.gray(JSON.stringify(parsedData, null, 2)));
      console.log(chalk.green(`Импортированы данные из файла: ${inputFile}\n`));
    });

    readStream.on('error', (error: Error) => {
      console.error(chalk.red(`Ошибка при импорте данных: ${(error as Error).message}`));
    });
  } catch (error) {
    console.error(chalk.red(`Ошибка при открытии файла: ${(error as Error).message}`));
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
    images: images.split(','),
    premium: Boolean(premium),
    favorite: Boolean(favorite),
    rating: Number(rating),
    type: type as RentOffer['type'],
    rooms: Number(rooms),
    guests: Number(guests),
    price: Number(price),
    features: features.split(','),
    user: {
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

function printHelp(): void {
  console.log(chalk.yellowBright(`
  Список поддерживаемых команд:

  ${chalk.bold('version')}:                      # выводит номер версии
  ${chalk.bold('help')}:                         # печатает этот текст
  ${chalk.bold('import <path>')}:                # импортирует данные из TSV
  ${chalk.bold('generate <n> <path> <url>')}     # генерирует произвольное количество тестовых данных
  `));
}

const cities = {
  'Paris': { latitude: 48.85661, longitude: 2.351499 },
  'Cologne': { latitude: 50.938361, longitude: 6.959974 },
  'Brussels': { latitude: 50.846557, longitude: 4.351697 },
  'Amsterdam': { latitude: 52.370216, longitude: 4.895168 },
  'Hamburg': { latitude: 53.550341, longitude: 10.000654 },
  'Dusseldorf': { latitude: 51.225402, longitude: 6.776314 }
};

const types = ['apartment', 'house', 'room', 'hotel'];
const features = ['Breakfast', 'Air conditioning', 'Laptop friendly workspace', 'Baby seat', 'Washer', 'Towels', 'Fridge'];

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomBoolean(): boolean {
  return Math.random() < 0.5;
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomRentOfferWithUser(): RentOfferWithUser {
  const city = getRandomElement(Object.keys(cities));
  return {
    name: `Random Offer ${Math.random().toString(36).slice(2, 12)}`,
    description: 'Random description',
    publishedAt: new Date(),
    city: city,
    previewImage: 'https://example.com/random-preview.jpg',
    images: [getRandomElement(features)],
    premium: getRandomBoolean(),
    favorite: getRandomBoolean(),
    rating: Math.random() * 4 + 1,
    type: getRandomElement(types),
    rooms: getRandomInt(1, 8),
    guests: getRandomInt(1, 10),
    price: Math.floor(Math.random() * 90000 + 100),
    features: Array.from({ length: getRandomInt(1, 6) }, () => getRandomElement(features)),
    user: {
      id: Math.random().toString(36).slice(2, 12),
      name: `User ${Math.random().toString(36).slice(2, 12)}`,
      email: `${Math.random().toString(36).slice(2, 12)}@example.com`,
      avatar: '',
      password: 'password123',
      type: 'обычный'
    },
    coordinates: {
      latitude: Number(Object.values(cities)[Object.keys(cities).indexOf(city)].latitude),
      longitude: Number(Object.values(cities)[Object.keys(cities).indexOf(city)].longitude)
    }
  };
}

async function generateTestData(n: number, filepath: string): Promise<void> {
  const rentOffers: RentOfferWithUser[] = Array.from({ length: n }, generateRandomRentOfferWithUser);

  const tsvData = rentOffers.map((offer) => [
    offer.name,
    offer.description,
    offer.publishedAt.toISOString(),
    offer.city,
    offer.previewImage,
    offer.images.join(','),
    offer.premium.toString(),
    offer.favorite.toString(),
    offer.rating.toFixed(1),
    offer.type,
    offer.rooms.toString(),
    offer.guests.toString(),
    offer.price.toString(),
    offer.features.join(','),
    offer.user.id,
    offer.user.name,
    offer.user.email,
    offer.user.avatar || '',
    offer.user.password,
    offer.user.type,
    offer.coordinates.latitude.toString(),
    offer.coordinates.longitude.toString()
  ].join('\t')).join('\n');

  await fs.writeFile(filepath, tsvData, 'utf8');
  console.log(chalk.green(`Генерированы ${n} тестовых предложений в файле: ${filepath}`));
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  try {
    const packageJsonString = await fs.readFile(path.join(__dirname, '..', 'package.json'), 'utf-8');
    const packageJson: PackageJson = JSON.parse(packageJsonString);

    if (args.length === 0) {
      printHelp();
    }

    switch (args[0]) {
      case 'help':
        printHelp();
        break;
      case 'version':
        console.log(chalk.cyan(`Версия: ${packageJson.version}`));
        break;
      case 'import': {
        if (args.length !== 2) {
          console.error(chalk.red('Пожалуйста, укажите путь к файлу для импорта.'));
          printHelp();
          return;
        }
        await importData(args[1]);
        break;
      }
      case 'generate': {
        if (args.length !== 4) {
          console.error(chalk.red('Пожалуйста, укажите количество записей, путь к файлу и URL сервера.'));
          printHelp();
          return;
        }

        const n = parseInt(args[1], 10);
        const filepath = args[2];
        const url = args[3];
        console.log(url);

        if (isNaN(n) || n <= 0) {
          console.error(chalk.red('Количество записей должно быть положительным числом.'));
          return;
        }

        await generateTestData(n, filepath);
        break;
      }
      default:
        console.error(chalk.red('Используйте --help для просмотра списка команд.'));
    }
  } catch (error) {
    console.error(chalk.red(`Ошибка при чтении package.json: ${(error as Error).message}`));
  }
}

main().catch(console.error);
