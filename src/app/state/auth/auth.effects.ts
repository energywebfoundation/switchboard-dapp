import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { IamService } from '../../shared/services/iam.service';
import { Store } from '@ngrx/store';
import { AuthState } from './auth.reducer';
import * as AuthActions from './auth.actions';
import { map, switchMap } from 'rxjs/operators';
import { IAM } from 'iam-client-lib';
import { from } from 'rxjs';


@Injectable()
export class AuthEffects {

  metamaskLogIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.init),
      switchMap(() =>
        from(IAM.isMetamaskExtensionPresent())
          .pipe(
            map(({isMetamaskPresent, chainId}) =>
              AuthActions.setMetamaskLoginOptions({
                present: !!isMetamaskPresent,
                chainId
              })
            )
          )
      )
    )
  );

  constructor(private actions$: Actions,
              private store: Store<AuthState>,
              private iamService: IamService) {
  }

}
