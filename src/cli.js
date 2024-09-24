#!/usr/bin/env node

import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

/*
  cd src
  node cli.js --help
 */

async function importData(inputFile) {
  try {
    const data = await fs.readFile(inputFile, 'utf-8');
    console.log(chalk.green(`Импортированы данные из файла: ${inputFile}\n`));
    console.log(chalk.gray(data));
  } catch (error) {
    console.error(chalk.red(`Ошибка при импорте данных: ${error.message}`));
  }
}

function printHelp() {
  console.log(chalk.yellowBright(`
  Список поддерживаемых команд:

  ${chalk.bold('--version')}:                   # выводит номер версии
  ${chalk.bold('--help')}:                      # печатает этот текст
  ${chalk.bold('--import <path>')}:             # импортирует данные из TSV
  ${chalk.bold('--generate <n> <path> <url>')}     # генерирует произвольное количество тестовых данных (В данный момент не поддерживается)
  `));
}

async function main() {
  const args = process.argv.slice(2);
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const packageJson = JSON.parse(await fs.readFile(path.join(__dirname, '..', 'package.json'), 'utf-8'));

  if (args.length === 0) {
    printHelp();
  }

  switch (args[0]) {
    case '--help':
      printHelp();
      break;
    case '--version': {
      console.log(chalk.cyan(`Версия: ${packageJson.version}`));
      break;
    }
    case '--import': {
      if (args.length !== 2) {
        console.error(chalk.red('Пожалуйста, укажите путь к файлу для импорта.'));
        printHelp();
        return;
      }
      await importData(args[1]);
      break;
    }
    case '--generate': {
      console.error(chalk.redBright('Команда --generate не поддерживается.'));
      break;
    }
    default:
      console.error(chalk.red('Используйте --help для просмотра списка команд.'));
  }
}

main().catch(console.error);