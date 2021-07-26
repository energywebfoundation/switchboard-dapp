import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RegistrationModule } from './registration/registration.module';
import { RoutingModule } from './routes';
import { EwtPatronModule } from './ewt-patron/ewt-patron.module';


@NgModule({
  imports: [
    RoutingModule,
    RegistrationModule,
    EwtPatronModule
  ],
  exports: [
    RouterModule
  ]
})
export class RoutesModule {
}




