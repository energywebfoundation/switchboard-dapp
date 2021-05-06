import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ProfileModule } from './profile/profile.module';
import { RegistrationModule } from './registration/registration.module';
import { routes } from './routes';
import { WelcomeModule } from './welcome/welcome.module';
import { EnrolmentModule } from './enrolment/enrolment.module';
import { ApplicationsModule } from './applications/applications.module';
import { WidgetsModule } from './widgets/widgets.module';
import { SearchResultModule } from './search-result/search-result.module';
import { AssetsModule } from './assets/assets.module';


@NgModule({
  imports: [
    SharedModule,
    RouterModule.forRoot(routes, { useHash: true, onSameUrlNavigation: 'reload' }),
    ProfileModule,
    RegistrationModule,
    WelcomeModule,
    ApplicationsModule,
    AssetsModule,
    EnrolmentModule,
    SearchResultModule,
    WidgetsModule
  ],
  declarations: [],
  exports: [
    RouterModule
  ]
})
export class RoutesModule {
}




