import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as application from './application.reducer';
import { ApplicationEffects } from './application.effects';

@NgModule({
  imports: [
    StoreModule.forFeature(application.USER_FEATURE_KEY, application.reducer),
    EffectsModule.forFeature([ApplicationEffects]),
  ],
})
export class ApplicationStoreSliceModule {}
