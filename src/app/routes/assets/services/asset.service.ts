import { Injectable } from '@angular/core';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { IamService } from '../../../shared/services/iam.service';
import { CancelButton } from '../../../layout/loading/loading.component';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

const TOASTR_HEADER = 'Register Single Asset';
const REGISTER_ASSET_ERROR = 'Could not register asset at this time. Please contact system administrator';
const REGISTER_ASSET_SUCCESS = 'New asset is successfully registered.';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  constructor(private toastr: SwitchboardToastrService,
              private iamService: IamService) {
  }

  register() {
    return this.iamService.wrapWithLoadingService(
      this.iamService.registerAsset(), {
        message: 'Please confirm this transaction in your connected wallet.',
        cancelable: CancelButton.ENABLED
      }).pipe(
      map(() => this.toastr.success(REGISTER_ASSET_SUCCESS, TOASTR_HEADER)),
      catchError((e) => {
        console.error(e);
        this.toastr.error(e.message || REGISTER_ASSET_ERROR, TOASTR_HEADER);
        return throwError(e.message);
      }),
    );
  }
}
