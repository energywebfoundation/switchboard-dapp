import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { rootReducer } from './root.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { AssetsStoreSliceModule } from './assets/assets-store-slice.module';
import { UserEffects } from './user-claim/user.effects';
import { AuthEffects } from './auth/auth.effects';
import { environment } from 'src/environments/environment';
import { OrganizationStoreSliceModule } from './governance/organization/organization-store-slice.module';
import { LayoutStoreSliceModule } from './layout/layout-store-slice.module';
import { ApplicationStoreSliceModule } from './governance/application/application-store-slice.module';
import { RoleStoreSliceModule } from './governance/role/role-store-slice.module';
import { SettingsStoreSliceModule } from './settings/settings-store-slice.module';
import { EnrolmentsStoreSliceModule } from './enrolments/enrolments-store-slice.module';

@NgModule({
  imports: [
    StoreModule.forRoot(rootReducer, {}),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    EffectsModule.forRoot([UserEffects, AuthEffects]),
    AssetsStoreSliceModule,
    OrganizationStoreSliceModule,
    LayoutStoreSliceModule,
    ApplicationStoreSliceModule,
    RoleStoreSliceModule,
    SettingsStoreSliceModule,
    EnrolmentsStoreSliceModule,
  ],
})
export class StoreRootModule {}
