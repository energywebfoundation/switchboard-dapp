import './vendor.ts';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

const p = platformBrowserDynamic().bootstrapModule(AppModule);
p.then(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).appBootstrap && (window as any).appBootstrap();
});
// .catch(err => console.error(err));
