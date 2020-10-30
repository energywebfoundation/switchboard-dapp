import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { IamService } from 'src/app/shared/services/iam.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

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
    private iamService: IamService,
    private toastr: ToastrService,
    private loadingService: LoadingService,
    private notifService: NotificationService) { }

  async ngOnInit() {
    this.listType = this.data.listType;
    this.claim = this.data.claimData;

    if (this.claim && this.claim.token) {
      let decoded = await this.iamService.iam.decodeJWTToken({
        token: this.claim.token
      });

      if (decoded['claimData'] && decoded['claimData']['fields']) {
        this.fields = decoded['claimData']['fields'];
      }
    }
  }

  async approve() {
    this.loadingService.show('Please confirm this transaction in your connected wallet.');

    try {
      let req = {
        requesterDID: this.claim.requester,
        id: this.claim.id,
        token: this.claim.token
      };

      console.log('issue claim', req);
      await this.iamService.iam.issueClaimRequest(req);

      this.notifService.decreasePendingApprovalCount();
      this.toastr.success('Request is approved.', TOASTR_HEADER);
      this.dialogRef.close(true);
    }
    catch (e) {
      this.toastr.error(e, TOASTR_HEADER);
    }
    finally {
      this.loadingService.hide();
    }
  }

  reject() {
    this.toastr.warning('Request is rejected.', TOASTR_HEADER);
    this.dialogRef.close(true);
  }
}