import { Injectable } from '@angular/core';
import { IamService } from '../iam.service';
import { from, of } from 'rxjs';
import { LoadingService } from '../loading.service';
import { catchError, finalize } from 'rxjs/operators';

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
    return from(this.iamService.assetsService.getOfferedAssets()).pipe(
      catchError((error) => {
        if (error?.status === 404 || String(error?.message).includes('404')) {
          return of([]);
        }
        throw error;
      })
    );
  }
}
