import { APP_INITIALIZER, ErrorHandler, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EnvService } from '../env/env.service';
import { BrowserTracing } from '@sentry/tracing';
import * as Sentry from '@sentry/angular';

@Injectable()
export class SentryService {
  constructor(private envService: EnvService) {}

  initSentry(): void {
    return Sentry.init({
      dsn: SENTRY_DSN,
      environment: this.envService.SENTRY_ENVIRONMENT,
      integrations: [new BrowserTracing()],
      tracesSampleRate: 0.2,
    });
  }

  error(message: string) {
    Sentry.captureMessage(message, 'error');
  }

  info(message: string) {
    Sentry.captureMessage(message, 'info');
  }
}

const SentryConfigFactory = (config: SentryService) => () =>
  config.initSentry();

export const SENTRY_PROVIDERS = [
  SentryService,
  {
    provide: APP_INITIALIZER,
    useFactory: SentryConfigFactory,
    deps: [SentryService],
    multi: true,
  },
  {
    provide: ErrorHandler,
    useValue: Sentry.createErrorHandler({
      showDialog: false,
    }),
  },
  {
    provide: Sentry.TraceService,
    deps: [Router],
  },
  {
    provide: APP_INITIALIZER,
    //eslint-disable-next-line
    useFactory: () => () => {},
    deps: [Sentry.TraceService],
    multi: true,
  },
];
