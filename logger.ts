// import { createAndWriteFile, logFileName } from '@/utils/fileUtil';
import moment from 'moment';

const defaultTimeGap = 5000;
let logTemp = '';
let lastLoggedTime = 0;

enum Level {
  INFO = "INFO",
  DEBUG = "DEBUG",
  WARN = "WARN",
  ERROR = "ERROR",
}

const log = (level: Level, msg: string) => {
  const formattedMsg = `[${level}] ${msg}`;
  if (level === Level.ERROR) {
    console.error(formattedMsg);
  } else {
    console.debug(formattedMsg);
  }
  /*
  try {
    logTemp += `${formattedMsg}\n`;
    if (window.cordova && window.cordova.file) {
      const writeLog = () => {
        const timeGap = new Date().getTime() - lastLoggedTime;
        if (timeGap > defaultTimeGap && logTemp.length > 0) {
          console.debug('logTemp...', new Date().getTime());
          createAndWriteFile(logFileName, logTemp);
          logTemp = '';
          lastLoggedTime = new Date().getTime();
        }
      };
      setTimeout(writeLog, defaultTimeGap);
    }
  } catch (err) {
    console.warn(err);
  }
  */
};

const info = (message: string) => {
  log(Level.INFO, `[${moment().format('YYYY-MM-DD HH:mm:ss')}] => ${message}`);
};

const debug = (message: string) => {
  log(Level.DEBUG, `[${moment().format('YYYY-MM-DD HH:mm:ss')}] => ${message}`);
};

const warn = (message: string) => {
  log(Level.WARN, `[${moment().format('YYYY-MM-DD HH:mm:ss')}] => ${message}`);
};

const error = (message: string, err?: any) => {
  if (err) {
    log(
      Level.ERROR,
      `[${moment().format('YYYY-MM-DD HH:mm:ss')}] => ${message}:\n ${err.message}-${err.stack}`
    );
  } else {
    log(Level.ERROR, `[${moment().format('YYYY-MM-DD HH:mm:ss')}] => ${message}`);
  }
};

export default {
  info,
  debug,
  warn,
  error,
};
