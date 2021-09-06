import { NgModule, } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { rootReducer } from './root.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { PoolEffects } from './pool/pool.effects';
import { EffectsModule } from '@ngrx/effects';
import { AssetsStoreSliceModule } from './assets/assets-store-slice.module';
import { UserEffects } from './user-claim/user.effects';
import { AuthEffects } from './auth/auth.effects';
import { StakeEffects } from './stake/stake.effects';
import { environment } from 'src/environments/environment';


@NgModule({
  imports: [
    StoreModule.forRoot(rootReducer, {}),
    StoreDevtoolsModule.instrument({maxAge: 25, logOnly: environment.production}),
    EffectsModule.forRoot([UserEffects, StakeEffects, AuthEffects, PoolEffects]),
    AssetsStoreSliceModule
  ],
})
export class StoreRootModule {
}
