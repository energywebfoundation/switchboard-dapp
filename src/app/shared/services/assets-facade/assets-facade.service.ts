import { Injectable } from '@angular/core';
import { IamService } from '../iam.service';
import { from } from 'rxjs';
import { LoadingService } from '../loading.service';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AssetsFacadeService {
  constructor(
    private iamService: IamService,
    private loadingService: LoadingService
  ) {}

  getOwnedAssets() {
    this.loadingService.show('Loading owned assets');
    return from(this.iamService.assetsService.getOwnedAssets()).pipe(
      finalize(() => this.loadingService.hide())
    );
  }

  getOfferedAssets() {
    return this.iamService.assetsService.getOfferedAssets();
  }
}
