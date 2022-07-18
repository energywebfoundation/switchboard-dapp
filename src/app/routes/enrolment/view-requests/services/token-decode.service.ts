import { Injectable } from '@angular/core';
import { IamService } from '../../../../shared/services/iam.service';
import { from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { KeyValue } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class TokenDecodeService {
  constructor(private iamService: IamService) {}

  getIssuerFields(
    token: string
  ): Observable<KeyValue<string, string | number>[]> {
    return this.decode(token).pipe(
      map((decoded) =>
        decoded?.claimData?.issuerFields ? decoded?.claimData?.issuerFields : []
      )
    );
  }

  getRequestorFields(
    token: string
  ): Observable<KeyValue<string, string | number>[]> {
    return this.decode(token).pipe(
      map((decoded) => {
        if (decoded?.claimData?.requestorFields) {
          return decoded.claimData.requestorFields;
        }

        if (decoded?.claimData?.fields) {
          return decoded.claimData.fields;
        }

        return [];
      })
    );
  }

  private decode(token): Observable<any> {
    if (!token) {
      return of(null);
    }
    return from(
      this.iamService.didRegistry.decodeJWTToken({
        token,
      })
    );
  }
}
