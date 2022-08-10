import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { deepEqualObjects } from '@utils';
import { UserClaimActions, UserClaimSelectors } from '@state';

@Component({
  selector: 'app-dialog-user',
  templateUrl: 'dialog-user.component.html',
  styleUrls: ['../header.component.scss'],
})
export class DialogUserComponent implements OnInit, OnDestroy {
  public profileForm: FormGroup = this.fb.group({
    name: ['', [Validators.maxLength(256), Validators.required]],
  });
  private defaultFormValues;
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private store: Store) {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.store
      .select(UserClaimSelectors.getUserData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((profile) => {
        this.profileForm.patchValue({
          name: profile?.name,
        });
        this.defaultFormValues = this.profileForm.value;
      });
  }

  disableSubmit(): boolean {
    return (
      this.profileForm.pristine ||
      this.profileForm.invalid ||
      deepEqualObjects(this.defaultFormValues, this.profileForm.value)
    );
  }

  save() {
    if (this.profileForm.invalid) {
      return;
    }
    this.store.dispatch(
      UserClaimActions.updateUserData({ userData: this.getProfile() })
    );
  }

  private getProfile() {
    const profileData = this.profileForm.getRawValue();
    return {
      ...profileData,
    };
  }
}
