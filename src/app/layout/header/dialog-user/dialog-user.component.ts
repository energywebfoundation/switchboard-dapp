import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as userSelectors from '../../../state/user-claim/user.selectors';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as userActions from '../../../state/user-claim/user.actions';
import { UserClaimState } from '../../../state/user-claim/user.reducer';
import { Profile } from 'iam-client-lib';
import { deepEqualObjects } from '../../../utils/functions/deep-equal-objects/deep-equal-objects';

const MAJORITY_AGE = 18;

@Component({
  selector: 'app-dialog-user',
  templateUrl: 'dialog-user.component.html',
  styleUrls: ['../header.component.scss']
})
export class DialogUserComponent implements OnInit, OnDestroy {

  public profileForm: FormGroup = this.fb.group({
    name: ['', [
      Validators.maxLength(256),
      Validators.required
    ]],
    birthdate: ['', Validators.required],
    address: ['', [
      Validators.maxLength(500),
      Validators.required
    ]]
  });
  private defaultFormValues;
  public maxDate: Date;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store<UserClaimState>) {
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.maxDate = this.getLegalAge();
    this.store.select(userSelectors.getUserProfile)
      .pipe(takeUntil(this.destroy$))
      .subscribe(profile => {
        this.profileForm.patchValue({
          name: profile?.name,
          birthdate: new Date(profile?.birthdate),
          address: profile?.address
        });
        this.defaultFormValues = this.profileForm.value;
      });
  }

  disableSubmit(): boolean {
    return this.profileForm.pristine || this.profileForm.invalid || deepEqualObjects(this.defaultFormValues, this.profileForm.value);
  }

  save() {
    if (this.profileForm.invalid) {
      return;
    }
    this.store.dispatch(userActions.updateUserClaims({profile: this.getProfile()}));
  }

  private getProfile(): Partial<Profile> {
    const profileData = this.profileForm.getRawValue();
    return {
      ...profileData,
      birthdate: profileData.birthdate.getTime()
    };
  }

  private getLegalAge() {
    const today = new Date();
    today.setFullYear(today.getFullYear() - MAJORITY_AGE);
    return today;
  }
}
