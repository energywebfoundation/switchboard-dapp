import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CancelButton } from 'src/app/layout/loading/loading.component';
import { IamService } from 'src/app/shared/services/iam.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-passive-asset',
  templateUrl: './new-passive-asset.component.html',
  styleUrls: ['./new-passive-asset.component.scss']
})
export class NewPassiveAssetComponent implements OnInit {

  private TOASTR_HEADER = 'Register Single Asset';

  constructor(public dialogRef: MatDialogRef<NewPassiveAssetComponent>,
    private loadingService: LoadingService,
    private toastr: ToastrService,
    private iamService: IamService) { }

  ngOnInit(): void {

  }

  async registerAsset() {
    let success = false;
    try {
      this.loadingService.show('Please confirm this transaction in your connected wallet.', CancelButton.ENABLED);
      let assetAddress = await this.iamService.iam.registerAsset();
      this.toastr.success('New asset is successfully registered.', this.TOASTR_HEADER);
      success = true;
    }
    catch (e) {
      console.error(e);
      this.toastr.error(e.message || 'Could not register asset at this time. Please contact system administrator', 
        this.TOASTR_HEADER);
    }
    finally {
      this.loadingService.hide();
      this.closeDialog(success);
    }
  }

  closeDialog(isSuccess?: boolean) {
    this.dialogRef.close(!!isSuccess);
  }
}
