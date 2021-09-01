import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AssetDetailsEffects } from './details/asset-details.effects';
import * as assets from './assets.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(assets.USER_FEATURE_KEY, assets.reducer),
    EffectsModule.forFeature([AssetDetailsEffects])
  ],
})
export class AssetsStoreSliceModule {
}
