import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { IamService } from '../../shared/services/iam.service';

@Injectable()
export class OrganizationEffects {

  constructor(private actions$: Actions,
              private store: Store,
              private iamService: IamService,
  ) {
  }

}
