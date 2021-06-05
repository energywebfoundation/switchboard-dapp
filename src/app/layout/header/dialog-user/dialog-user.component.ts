import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { IamService } from 'src/app/shared/services/iam.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { CancelButton } from '../../loading/loading.component';
import { Store } from '@ngrx/store';
import * as userSelectors from '../../../state/user-claim/user.selectors';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dialog-user',
  templateUrl: 'dialog-user.component.html',
  styleUrls: ['../header.component.scss']
})
export class DialogUserComponent implements OnInit, OnDestroy {

  public profileForm: FormGroup;
  public maxDate: Date;
  private profileCache: any;
  private destroy$ = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<DialogUserComponent>,
    private fb: FormBuilder,
    private iamService: IamService,
    private toastr: ToastrService,
    private loadingService: LoadingService,
    private store: Store) {
    this.profileForm = fb.group({
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

    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    this.maxDate = today;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
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
      this.loadingService.show('Please confirm this transaction in your connected wallet.', CancelButton.ENABLED);

      let data = this.profileForm.getRawValue();

      if (data.birthdate) {
        const date = data.birthdate.getTime();
        data = JSON.parse(JSON.stringify(data));
        data.birthdate = date;
      }

      // console.log('data', data);
      try {
        await this.iamService.iam.createSelfSignedClaim({
          data: {
            profile: {
              ...this.profileCache,
              ...data
            }
          }
        });
        this.toastr.success('Identity is updated.', 'Success');
        this.dialogRef.close(true);
      } catch (e) {
        console.error('Saving Identity Error', e);
        this.toastr.error(e.message, 'System Error');
      } finally {
        this.loadingService.hide();
      }
    }
  }
}
