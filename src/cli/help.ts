import chalk from 'chalk';

export function printHelp(): void {
  console.log(chalk.yellowBright(`
  Список поддерживаемых команд:

  ${chalk.bold('version')}:                      # выводит номер версии
  ${chalk.bold('help')}:                         # печатает этот текст
  ${chalk.bold('import <path>')}:                # импортирует данные из TSV
    ${chalk.italic('Прежде, чем использовать import, запустите базу данных и убедитесь, что в .env указан верный путь')}
  ${chalk.bold('generate <n> <path> <url>')}     # генерирует произвольное количество тестовых данных
    ${chalk.italic('Прежде, чем использовать generate, запустите сервер (или убедитесь, что он запущен): npm run mock-server')}

  ${chalk.italic('Примеры использования:')}

  ${chalk.italic('npm run cli -- help')}
  ${chalk.italic('npm run cli -- generate 30 ./mocks/test_data.tsv http://localhost:3000/randomData')}
  ${chalk.italic('npm run cli -- import ./mocks/test_data.tsv')}
  `));
}
