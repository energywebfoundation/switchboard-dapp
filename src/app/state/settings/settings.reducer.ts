import { Action, createReducer, on } from '@ngrx/store';
import * as SettingsActions from './settings.actions';
import { SettingsStorage } from './models/settings-storage';

export const USER_FEATURE_KEY = 'settings';

export interface SettingsState {
  experimentalEnabled: boolean;
}

export const initialState: SettingsState = {
  experimentalEnabled: false,
};

const settingsReducer = createReducer(
  initialState,
  on(SettingsActions.enableExperimental, (state) => {
    SettingsStorage.toggleExperimental('true');
    return { ...state, experimentalEnabled: true };
  }),
  on(SettingsActions.disableExperimental, (state) => {
    SettingsStorage.toggleExperimental('false');
    return { ...state, experimentalEnabled: false };
  })
);

export function reducer(state: SettingsState | undefined, action: Action) {
  return settingsReducer(state, action);
}
