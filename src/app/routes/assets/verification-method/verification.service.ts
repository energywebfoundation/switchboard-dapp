import { Injectable } from '@angular/core';
import { LoadingService } from '../../../shared/services/loading.service';
import { from, of } from 'rxjs';
import { DIDAttribute, PubKeyType } from 'iam-client-lib';
import { catchError, finalize, map, switchMap, tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { CancelButton } from '../../../layout/loading/loading.component';
import { retryWhenWithDelay } from '@operators';
import { DidRegistryFacadeService } from '../../../shared/services/did-registry-facade/did-registry-facade.service';

@Injectable({
  providedIn: 'root',
})
export class VerificationService {
  constructor(
    private didRegistryFacade: DidRegistryFacadeService,
    private loadingService: LoadingService,
    private toastr: SwitchboardToastrService
  ) {}

  getPublicKeys(did, includeClaims) {
    this.loadingService.show();
    return this.loadDocumentPublicKeys(did, includeClaims).pipe(
      finalize(() => this.loadingService.hide())
    );
  }

  updateDocumentAndReload(
    did: string,
    publicKey: string,
    publicKeysAmount: number
  ) {
    this.loadingService.show(
      'Please confirm this transaction in your connected wallet.',
      CancelButton.ENABLED
    );
    return from(
      this.didRegistryFacade.updateDocument(
        this.getUpdateOptions(did, publicKey)
      )
    )
      .pipe(
        catchError((err) => {
          this.loadingService.hide();
          this.toastr.error(
            'Error occurred while adding New Verification Type',
            'Asset Verification'
          );
          console.error(err);
          return of(err);
        })
      )
      .pipe(
        switchMap(() => this.loadDocumentPublicKeys(did, true)),
        tap((publicKeys) => {
          if (publicKeys.length !== publicKeysAmount) {
            this.toastr.success(
              'New Verification Type has been successfully added.',
              'Asset Verification'
            );
          }
        }),
        map((publicKeys) => {
          if (publicKeys.length === publicKeysAmount) {
            throw publicKeys;
          }
          return publicKeys;
        }),
        retryWhenWithDelay(),
        catchError((err) => {
          this.loadingService.hide();
          this.toastr.error(
            "Backend hasn't been updated with newest blockchain data",
            'Asset Verification'
          );
          console.error(err);
          return of(err);
        }),
        finalize(() => this.loadingService.hide())
      );
  }

  private loadDocumentPublicKeys(did, includeClaims) {
    return from(
      this.didRegistryFacade.getDidDocument({ did, includeClaims })
    ).pipe(map((document) => document.publicKey));
  }

  private getUpdateOptions(did: string, publicKey: string) {
    return {
      didAttribute: DIDAttribute.PublicKey,
      did,
      data: {
        type: PubKeyType.SignatureAuthentication2018,
        value: { publicKey, tag: uuidv4() },
      },
    };
  }
}
