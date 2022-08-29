import { APP_INITIALIZER, ErrorHandler, Injectable } from '@angular/core';
import * as Sentry from '@sentry/angular';
import { Router } from '@angular/router';
import { EnvService } from '../env/env.service';

@Injectable()
export class SentryService {
  constructor(private envService: EnvService) {}

  initSentry(): void {
    return Sentry.init({
      dsn: SENTRY_DSN,
      environment: this.envService.SENTRY_ENVIRONMENT,
      tracesSampleRate: 0.2,
    });
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
