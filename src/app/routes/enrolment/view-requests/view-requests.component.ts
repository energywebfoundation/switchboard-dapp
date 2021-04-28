import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CancelButton } from 'src/app/layout/loading/loading.component';
import { IamService } from 'src/app/shared/services/iam.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ConfirmationDialogComponent } from '../../widgets/confirmation-dialog/confirmation-dialog.component';

const TOASTR_HEADER = 'Enrolment Request';

@Component({
  selector: 'app-view-requests',
  templateUrl: './view-requests.component.html',
  styleUrls: ['./view-requests.component.scss']
})
export class ViewRequestsComponent implements OnInit {
  listType: string;
  claim: any;
  fields = [];

  constructor(public dialogRef: MatDialogRef<ViewRequestsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public dialog: MatDialog,
              private iamService: IamService,
              private toastr: ToastrService,
              private loadingService: LoadingService,
              private notifService: NotificationService) {
  }

  async ngOnInit() {
    this.listType = this.data.listType;
    this.claim = this.data.claimData;

    if (this.claim && this.claim.token) {
      const decoded = await this.iamService.iam.decodeJWTToken({
        token: this.claim.token
      });

      if (decoded['claimData'] && decoded['claimData']['fields']) {
        this.fields = decoded['claimData']['fields'];
      }
    }
  }

  async approve() {
    this.loadingService.show('Please confirm this transaction in your connected wallet.', CancelButton.ENABLED);

    try {
      const req = {
        requester: this.claim.requester,
        id: this.claim.id,
        token: this.claim.token
      };

      // console.log('issue claim', req);

      this.notifService.decreasePendingApprovalCount();
      this.toastr.success('Request is approved.', TOASTR_HEADER);
      this.dialogRef.close(true);
    }    catch (e) {
      this.toastr.error(e, TOASTR_HEADER);
    }    finally {
      this.loadingService.hide();
    }
  }

  reject() {
    this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      maxHeight: '195px',
      data: {
        header: TOASTR_HEADER,
        message: 'Are you sure to reject this request?',
        isDiscardButton: false
      },
      maxWidth: '100%',
      disableClose: true
    }).afterClosed().subscribe(async (res: any) => {
      if (res) {
        this.loadingService.show();
        try {
          await this.iamService.iam.rejectClaimRequest({
            id: this.claim.id,
            requesterDID: this.claim.requester
          });
          this.notifService.decreasePendingApprovalCount();
          this.toastr.success('Request is rejected successfully.', TOASTR_HEADER);
          this.dialogRef.close(true);
        } catch (e) {
          console.error(e);
        } finally {
          this.loadingService.hide();
        }
      }
    });
  }
}
