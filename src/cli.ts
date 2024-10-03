#!/usr/bin/env node

import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

/* node run cli -- help */

interface PackageJson {
  version: string;
}

export interface RentOffer {
  name: string;
  description: string;
  publishedAt: Date;
  city: 'Moscow' | 'Saint Petersburg' | 'Kazan' | 'Nizhny Novgorod' | 'Yekaterinburg' | 'Rostov-on-Don';
  previewImage: string;
  images: string[];
  premium: boolean;
  favorite: boolean;
  rating: number;
  type: 'apartment' | 'house' | 'room' | 'hotel';
  rooms: number;
  guests: number;
  price: number;
  features: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  password: string;
  type: 'обычный' | 'pro';
}

export interface RentOfferWithUser extends RentOffer {
  user: User;
}

async function importData(inputFile: string): Promise<void> {
  try {
    const data = await fs.readFile(inputFile, 'utf-8');
    
    // Парсинг данных из TVS файла
    const parsedData = parseTSV(data);
    
    console.log(chalk.green(`Импортированы данные из файла: ${inputFile}\n`));
    console.log(chalk.gray(JSON.stringify(parsedData, null, 2)));
  } catch (error) {
    console.error(chalk.red(`Ошибка при импорте данных: ${(error as Error).message}`));
  }
}

function printHelp(): void {
  console.log(chalk.yellowBright(`
  Список поддерживаемых команд:

  ${chalk.bold('version')}:                      # выводит номер версии
  ${chalk.bold('help')}:                         # печатает этот текст
  ${chalk.bold('import <path>')}:                # импортирует данные из TSV
  ${chalk.bold('generate <n> <path> <url>')}     # генерирует произвольное количество тестовых данных (В данный момент не поддерживается)
  `));
}

function parseTSV(data: string): RentOfferWithUser[] {
  const rows = data.split('\n').filter(row => row.trim().length > 0);
  
  return rows.map(row => {
    const fields = row.split('\t');
    
    // Удаление кавычек из начала и конца каждого поля
    const cleanedFields = fields.map(field => field.replace(/^"|"$/g, ''));

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
      coordinates
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
      coordinates
    } as RentOfferWithUser;
  });
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
      case 'generate': 
        console.error(chalk.redBright('Команда --generate не поддерживается.'));
        break;
      default:
        console.error(chalk.red('Используйте --help для просмотра списка команд.'));
    }
  } catch (error) {
    console.error(chalk.red(`Ошибка при чтении package.json: ${(error as Error).message}`));
  }
}

main().catch(console.error);
