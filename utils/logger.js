const chalk = require('chalk');
const moment = require('moment');
class Logger {
    static log(text, type = 'log') {
        const date = moment().format('DD/MM/YYYY hh:mm:ss');

        switch (type) {
            case 'log': {
                console.log(
                    `[${chalk.gray(date)}]`,
                    chalk.blueBright(`[${type.toUpperCase()}]`),
                    text
                );
                break;
            }
            case 'info': {
                console.log(
                    `[${chalk.gray(date)}]`,
                    chalk.greenBright(`[${type.toUpperCase()}]`),
                    chalk.green(text)
                );
                break;
            }
            case 'warn': {
                console.log(
                    `[${chalk.gray(date)}]`,
                    chalk.yellowBright(`[${type.toUpperCase()}]`),
                    chalk.yellow(text)
                );
                break;
            }
            case 'error': {
                console.log(
                    `[${chalk.gray(date)}]`,
                    chalk.redBright(`[${type.toUpperCase()}]`),
                    chalk.red(text)
                );
                break;
            }
            case 'music': {
                console.log(
                    `[${chalk.gray(date)}]`,
                    chalk.magentaBright(`[${type.toUpperCase()}]`),
                    chalk.magenta(text)
                );
                break;
            }
            default:
                throw new TypeError('Invalid log types');
        }
    }
}

module.exports = Logger;
