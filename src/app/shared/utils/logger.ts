import { ILogger, LogLevel, setLogger } from 'iam-client-lib';
import * as Sentry from '@sentry/angular';
import { Severity } from '@sentry/angular';

export const logger = () => {
  setLogger({
    log: (message) => {
      console.log(message);
    },
    error: (message) => {
      Sentry.captureMessage(message, Severity.Error);
      console.error(message);
    },
    info: (message) => {
      console.log(message);
    },
    warn: (message) => {
      Sentry.captureMessage(message, Severity.Warning);
      console.warn(message);
    },
    debug: (message) => {
      console.debug(message);
    },
    _logLevel: LogLevel.debug,
  } as unknown as ILogger);
};
