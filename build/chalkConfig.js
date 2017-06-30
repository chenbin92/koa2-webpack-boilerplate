// Centralized configuration for chalk, which is used to add color to console.log statements.
const chalk = require('chalk');

const chalkConfig = {
  chalkError: chalk.red,
  chalkSuccess: chalk.red,
  chalkWarning: chalk.green,
  chalkProcessing: chalk.yellow,
  chalkInfo: chalk.magenta,
};


module.exports = chalkConfig;
