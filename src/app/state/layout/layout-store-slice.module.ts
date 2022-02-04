import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { LayoutEffects } from './layout.effects';
import { reducer, USER_FEATURE_KEY } from './layout.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(USER_FEATURE_KEY, reducer),
    EffectsModule.forFeature([LayoutEffects]),
  ],
})
export class LayoutStoreSliceModule {}
