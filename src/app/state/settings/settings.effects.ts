import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as  SettingsActions from './settings.actions';
import { SettingsStorage } from './models/settings-storage';

@Injectable()
export class SettingsEffects {

  constructor(private actions$: Actions,
              private store: Store) {
    this.enableExperimental();
  }

  private enableExperimental() {
    if (SettingsStorage.isExperimentalEnabled()) {
      this.store.dispatch(SettingsActions.enableExperimental());
    }
  }
}
