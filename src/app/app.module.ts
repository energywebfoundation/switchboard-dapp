import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!
import { APP_INITIALIZER, NgModule, Provider } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { LayoutModule } from './layout/layout.module';
import { SharedModule } from './shared/shared.module';
import { RoutesModule } from './routes/routes.module';
import { MatIconModule } from '@angular/material/icon';
import 'hammerjs';
import { ToastrModule } from 'ngx-toastr';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ConfigService } from './shared/services/config.service';
import { StoreRootModule } from './state/store-root.module';
import { EnvServiceProvider } from './shared/services/env/env.service.factory';
import { SENTRY_PROVIDERS } from './shared/services/sentry/sentry.service';

const providers: Provider[] = [
  EnvServiceProvider,
  ConfigService,
  {
    provide: APP_INITIALIZER,
    deps: [ConfigService],
    useFactory: (configService: ConfigService) => () =>
      configService.loadConfigData(),
    multi: true,
  },
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    HttpClientModule,
    MatIconModule,
    BrowserAnimationsModule, // required for ng2-tag-input
    CoreModule,
    LayoutModule,
    SharedModule.forRoot(),
    ToastrModule.forRoot(),
    RoutesModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    StoreRootModule,
  ],
  providers: [...providers, ...SENTRY_PROVIDERS],
  bootstrap: [AppComponent],
})
export class AppModule {}
