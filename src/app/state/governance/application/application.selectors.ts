import { createFeatureSelector } from '@ngrx/store';
import { ApplicationState, USER_FEATURE_KEY } from './application.reducer';

export const getOrganizationState = createFeatureSelector<ApplicationState>(USER_FEATURE_KEY);
