import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as organization from './organization.reducer';
import { OrganizationEffects } from './organization.effects';

@NgModule({
  imports: [
    StoreModule.forFeature(organization.USER_FEATURE_KEY, organization.reducer),
    EffectsModule.forFeature([OrganizationEffects]),
  ],
})
export class OrganizationStoreSliceModule {}
