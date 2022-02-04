import { APP_INITIALIZER, ErrorHandler, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import * as Sentry from '@sentry/angular';
import { Router } from '@angular/router';
import { EnvService } from '../env/env.service';

@Injectable()
export class SentryService {
  constructor(private http: HttpClient, private envService: EnvService) {}

  /**
   * Storing DSN in github secrets to make it somewhat more difficult to obtain and so less likely that it will be abused.
   * https://github.com/getsentry/sentry-docs/pull/1723/files#r577851784
   * This is why the values is written to a file using the GHA workflow and is loaded here
   */
  public load() {
    return this.http
      .get<{ dsn: string }>('sentry-config.json', {
        headers: { 'Cache-Control': 'no-store' },
      })
      .pipe(
        map(({ dsn }) => this.initSentry(dsn)),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      )
      .toPromise();
  }

  initSentry(dsn: string): void {
    return Sentry.init({
      dsn,
      environment: this.envService.SENTRY_ENVIRONMENT,
      tracesSampleRate: 0.2,
    });
  }
}

const SentryConfigFactory = (config: SentryService) => () => config.load();

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
