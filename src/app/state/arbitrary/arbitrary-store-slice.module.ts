import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ArbitraryEffects } from './arbitrary.effects';
import { reducer, USER_FEATURE_KEY } from './arbitrary.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(USER_FEATURE_KEY, reducer),
    EffectsModule.forFeature([ArbitraryEffects])
  ],
})
export class ArbitraryStoreSliceModule {
}
