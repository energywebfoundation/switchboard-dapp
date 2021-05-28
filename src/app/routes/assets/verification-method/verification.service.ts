import { Injectable } from '@angular/core';
import { IamService } from '../../../shared/services/iam.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { from, of } from 'rxjs';
import { Algorithms, DIDAttribute, Encoding, PubKeyType } from 'iam-client-lib';
import { Keys } from '@ew-did-registry/keys';
import { catchError, finalize, map, switchMap, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class VerificationService {

  constructor(private iamService: IamService,
              private loadingService: LoadingService,
              private toastr: ToastrService) {
  }

  getPublicKeys(did, includeClaims) {
    this.loadingService.show();
    return this.loadDocumentPublicKeys(did, includeClaims).pipe(
      finalize(() => this.loadingService.hide())
    );
  }

  updateDocumentAndReload(did: string, publicKey: string) {
    this.loadingService.show();
    return from(
      this.iamService.iam.updateDidDocument(this.getUpdateOptions(did, publicKey))
    ).pipe(
      tap(() => this.toastr.success(
        'New Verification Type has been successfully added.',
        'Asset Verification')
      ),
      catchError(err => {
        this.loadingService.hide();
        this.toastr.error('Error occurred while adding New Verification Type', 'Asset Verification');
        console.error(err);
        return of(err);
      })
    ).pipe(
      switchMap(() => this.loadDocumentPublicKeys(did, true)),
      finalize(() => this.loadingService.hide())
    );
  }

  private loadDocumentPublicKeys(did, includeClaims) {
    return from(
      this.iamService.iam.getDidDocument({ did, includeClaims })
    ).pipe(
      map((document) => document.publicKey),
    );
  }

  private getUpdateOptions(did: string, publicKey: string) {
    return {
      didAttribute: DIDAttribute.PublicKey,
      did,
      data: {
        type: PubKeyType.SignatureAuthentication2018,
        value: { publicKey, tag: uuidv4() }
      }
    };
  }
}
