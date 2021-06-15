import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import * as userSelectors from '../../../state/user-claim/user.selectors';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as userActions from '../../../state/user-claim/user.actions';
import { UserClaimState } from '../../../state/user-claim/user.reducer';

const MAJORITY_AGE = 18;

@Component({
  selector: 'app-dialog-user',
  templateUrl: 'dialog-user.component.html',
  styleUrls: ['../header.component.scss']
})
export class DialogUserComponent implements OnInit, OnDestroy {

  public profileForm: FormGroup = this.fb.group({
    name: ['', Validators.compose([
      Validators.maxLength(256),
      Validators.required
    ])],
    birthdate: ['', Validators.required],
    address: ['', Validators.compose([
      Validators.maxLength(500),
      Validators.required
    ])]
  });
  public maxDate: Date;
  private destroy$ = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<DialogUserComponent>,
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
      .subscribe((profile => this.profileForm.patchValue({
        name: profile.name,
        birthdate: new Date(profile.birthdate),
        address: profile.address
      })));

  }

  async save() {
    if (this.profileForm.valid) {
      let data = this.profileForm.getRawValue();

      if (data.birthdate) {
        const date = data.birthdate.getTime();
        data = JSON.parse(JSON.stringify(data));
        data.birthdate = date;
      }

      this.store.dispatch(userActions.updateUserClaims({profile: data}));
    }
  }

  private getLegalAge() {
    const today = new Date();
    today.setFullYear(today.getFullYear() - MAJORITY_AGE);
    return today;
  }
}
