import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as enrolments from './enrolments.reducer';
import { EnrolmentRequestsEffects } from './requested/requested.effects';
import { OwnedEnrolmentsEffects } from './owned/owned.effects';
import { RevokableEnrolmentEffects } from './revokable/revokable.effects';

@NgModule({
  imports: [
    StoreModule.forFeature(enrolments.USER_FEATURE_KEY, enrolments.reducer),
    EffectsModule.forFeature([
      EnrolmentRequestsEffects,
      OwnedEnrolmentsEffects,
      RevokableEnrolmentEffects,
    ]),
  ],
})
export class EnrolmentsStoreSliceModule {}
