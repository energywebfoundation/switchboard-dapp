import { ILogger, LogLevel, setLogger } from 'iam-client-lib';
import * as Sentry from '@sentry/angular';
import { Severity } from '@sentry/angular';

export const logger = () => {
  setLogger({
    log: (message) => {
      Sentry.captureMessage(message, Severity.Log);
      console.log(message);
    },
    error: (message) => {
      Sentry.captureMessage(message, Severity.Error);
      console.error(message);
    },
    info: (message) => {
      Sentry.captureMessage(message, Severity.Info);
      console.log(message);
    },
    warn: (message) => {
      Sentry.captureMessage(message, Severity.Warning);
      console.warn(message);
    },
    debug: (message) => {
      Sentry.captureMessage(message, Severity.Debug);
      console.debug(message);
    },
    _logLevel: LogLevel.debug,
  } as unknown as ILogger);
};
