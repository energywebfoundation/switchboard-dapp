import { createFeatureSelector } from '@ngrx/store';
import { USER_FEATURE_KEY } from './organization.reducer';

export const getAssetDetailsState = createFeatureSelector(USER_FEATURE_KEY);

