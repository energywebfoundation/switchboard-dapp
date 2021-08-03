import { Component } from '@angular/core';
import { CancelButton } from '../../../layout/loading/loading.component';
import { IamService } from '../../../shared/services/iam.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { MatDialogRef } from '@angular/material/dialog';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';

@Component({
  selector: 'app-new-passive-asset',
  templateUrl: './new-passive-asset.component.html',
  styleUrls: ['./new-passive-asset.component.scss']
})
export class NewPassiveAssetComponent {

  private TOASTR_HEADER = 'Register Single Asset';

  constructor(public dialogRef: MatDialogRef<NewPassiveAssetComponent>,
              private loadingService: LoadingService,
              private toastr: SwitchboardToastrService,
              private iamService: IamService) {
  }

  async registerAsset() {
    let success = false;
    try {
      this.loadingService.show('Please confirm this transaction in your connected wallet.', CancelButton.ENABLED);
      const assetAddress = await this.iamService.iam.registerAsset();
      this.toastr.success('New asset is successfully registered.', this.TOASTR_HEADER);
      success = true;
    } catch (e) {
      console.error(e);
      this.toastr.error(e.message || 'Could not register asset at this time. Please contact system administrator',
        this.TOASTR_HEADER);
    } finally {
      this.loadingService.hide();
      this.closeDialog(success);
    }
  }

  closeDialog(isSuccess?: boolean) {
    this.dialogRef.close(!!isSuccess);
  }
}
