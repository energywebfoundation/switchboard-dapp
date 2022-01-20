import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SettingsEffects } from './settings.effects';
import { reducer, USER_FEATURE_KEY } from './settings.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(USER_FEATURE_KEY, reducer),
    EffectsModule.forFeature([SettingsEffects]),
  ],
})
export class SettingsStoreSliceModule {}
