import { BrowserAnimationsModule } from '@angular/platform-browser/animations' // this is needed!
import {
  NgModule,
  APP_INITIALIZER,
  ErrorHandler,
  Provider,
} from '@angular/core'
import { HttpClientModule, HttpClient } from '@angular/common/http'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { AppComponent } from './app.component'
import { CoreModule } from './core/core.module'
import { LayoutModule } from './layout/layout.module'
import { SharedModule } from './shared/shared.module'
import { RoutesModule } from './routes/routes.module'
import { MatIconModule } from '@angular/material'
import 'hammerjs'
import { ToastrModule } from 'ngx-toastr'
import { ServiceWorkerModule } from '@angular/service-worker'
import { environment } from '../environments/environment'
import { ConfigService } from './shared/services/config.service'

import * as Sentry from '@sentry/angular'

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json')
}

const providers: Provider[] = [
  ConfigService,
  {
    provide: APP_INITIALIZER,
    deps: [ConfigService],
    useFactory: (configService: ConfigService) => () =>
      configService.loadConfigData(),
    multi: true,
  },
]

if (environment.SENTRY_DNS) {
  providers.push({
    provide: ErrorHandler,
    useValue: Sentry.createErrorHandler({
      showDialog: false,
    }),
  })
}
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
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
  ],
  providers,
  bootstrap: [AppComponent],
})
export class AppModule {}
