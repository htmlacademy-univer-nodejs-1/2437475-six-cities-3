import chalk from 'chalk';

export function printHelp(): void {
  console.log(chalk.yellowBright(`
  Список поддерживаемых команд:

  ${chalk.bold('version')}:                      # выводит номер версии
  ${chalk.bold('help')}:                         # печатает этот текст
  ${chalk.bold('import <path>')}:                # импортирует данные из TSV
  ${chalk.bold('generate <n> <path> <url>')}     # генерирует произвольное количество тестовых данных
  `));
}
