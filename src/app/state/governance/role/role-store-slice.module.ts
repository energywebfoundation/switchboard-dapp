import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as role from './role.reducer';
import { RoleEffects } from './role.effects';

@NgModule({
  imports: [
    StoreModule.forFeature(role.USER_FEATURE_KEY, role.reducer),
    EffectsModule.forFeature([RoleEffects]),
  ],
})
export class RoleStoreSliceModule {}
