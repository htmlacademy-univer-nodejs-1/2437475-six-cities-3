#!/usr/bin/env node

import chalk from 'chalk';
import fs from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { RentOffer } from '../types.js';
import { User } from '../types.js';
import { RentOfferWithUser } from '../types.js';

/* npm run cli -- help
npm run cli -- generate 30 ./mocks/test_data.tsv http://localhost:3000/randomData
npm run cli -- import ./mocks/test_data.tsv
*/

interface City {
  latitude: number;
  longitude: number;
}

interface RandomUser {
  id: string[];
  name: string[];
  email: string[];
  avatar?: string[];
  password: string[];
  type: string[];
}

interface RandomData {
  name: string[];
  description: string[];
  publishedAt: string[];
  city: Record<string, City>;
  previewImage: string[];
  images: string[][];
  premium: boolean[];
  favorite: boolean[];
  rating: number[];
  type: string[];
  rooms: number[];
  guests: number[];
  price: number[];
  features: string[][];
  user: RandomUser;
}

interface ServerData {
  randomData: RandomData;
}

let ServerData: RandomData;

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
    images: images.split(';'),
    premium: Boolean(premium),
    favorite: Boolean(favorite),
    rating: Number(rating),
    type: type as RentOffer['type'],
    rooms: Number(rooms),
    guests: Number(guests),
    price: Number(price),
    features: features.split(';'),
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

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomRentOfferWithUser(): RentOfferWithUser {
  const data = ServerData;
  const city = getRandomElement(Object.keys(data.city));
  return {
    name: getRandomElement(data.name),
    description: getRandomElement(data.description),
    publishedAt: new Date(getRandomElement(data.publishedAt)),
    city: city,
    previewImage: getRandomElement(data.previewImage),
    images: getRandomElement(data.images),
    premium: getRandomElement(data.premium),
    favorite: getRandomElement(data.favorite),
    rating: getRandomElement(data.rating),
    type: getRandomElement(data.type),
    rooms: getRandomElement(data.rooms),
    guests: getRandomElement(data.guests),
    price: Math.floor(Math.random() * 90000 + 100),
    features: getRandomElement(data.features),
    user: {
      id: getRandomElement(data.user.id),
      name: getRandomElement(data.user.name),
      email: getRandomElement(data.user.email),
      avatar: getRandomElement(data.user.avatar || []),
      password: getRandomElement(data.user.password),
      type: getRandomElement(data.user.type) as 'обычный' | 'pro'
    },
    coordinates: {
      latitude: Number(data.city[city].latitude),
      longitude: Number(data.city[city].longitude)
    }
  };
}

async function generateTestData(n: number, filepath: string, url: string): Promise<void> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    ServerData = data as RandomData;
    // console.log(chalk.green('Полученные данные:', JSON.stringify(data, null, 2)));

  } catch (error) {
    console.error(chalk.red(`Ошибка при загрузке данных: ${(error as Error).message}`));
  }

  const rentOffers: RentOfferWithUser[] = Array.from({ length: n }, generateRandomRentOfferWithUser);

  const tsvData = rentOffers.map((offer) => [
    offer.name,
    offer.description,
    offer.publishedAt.toISOString(),
    offer.city,
    offer.previewImage,
    offer.images.join(';'),
    offer.premium.toString(),
    offer.favorite.toString(),
    offer.rating.toFixed(1),
    offer.type,
    offer.rooms.toString(),
    offer.guests.toString(),
    offer.price.toString(),
    offer.features.join(';'),
    offer.user.id,
    offer.user.name,
    offer.user.email,
    offer.user.avatar || '',
    offer.user.password,
    offer.user.type,
    offer.coordinates.latitude.toString(),
    offer.coordinates.longitude.toString()
  ].join('\t')).join('\n');

  const writeStream = createWriteStream(filepath, { flags: 'w' });

  const writeDataAsync = async () => {
    await new Promise((resolve) => {
      writeStream.on('finish', resolve);
      writeStream.write(tsvData);
    });
  };
  await writeDataAsync();

  console.log(chalk.green(`Сгенерированы ${n} тестовых предложений в файле: ${filepath}`));
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

        await generateTestData(n, filepath, url);
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
