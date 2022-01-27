import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RegistrationModule } from './registration/registration.module';
import { RoutingModule } from './routes';

@NgModule({
  imports: [RoutingModule, RegistrationModule],
  exports: [RouterModule],
})
export class RoutesModule {}
