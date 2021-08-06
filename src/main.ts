import './vendor.ts';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import * as Sentry from '@sentry/angular';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

environment.SENTRY_DNS && Sentry.init({
  dsn: environment.SENTRY_DNS,
  environment: environment.SENTRY_ENVIRONMENT,
  release: environment.SENTRY_RELEASE,
});

if (environment.production) {
  enableProdMode();
}

const p = platformBrowserDynamic().bootstrapModule(AppModule);
p.then(() => {
  (window as any).appBootstrap && (window as any).appBootstrap();
});
// .catch(err => console.error(err));
