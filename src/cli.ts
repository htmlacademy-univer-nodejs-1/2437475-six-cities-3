#!/usr/bin/env node

import chalk from 'chalk';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateTestData } from './cli/generate.js';
import { printHelp } from './cli/help.js';
import { importData } from './cli/import.js';

/* npm run cli -- help
npm run cli -- generate 30 ./mocks/test_data.tsv http://localhost:3000/randomData
npm run cli -- import ./mocks/test_data.tsv
*/

interface PackageJson {
  version: string;
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
