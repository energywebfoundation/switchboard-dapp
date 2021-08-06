import { FeatureToggle } from './feature-toggle.interface';
import { InjectionToken } from '@angular/core';
import { environment } from '../../../environments/environment';

export const FEAT_TOGGLE_TOKEN = new InjectionToken<FeatureToggle>('env');

export function getEnv(): FeatureToggle {
  return environment;
}
