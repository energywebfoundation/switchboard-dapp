import { TestBed } from '@angular/core/testing';

import { of, ReplaySubject, throwError } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { AssetDetailsEffects } from './asset-details.effects';
import * as AssetDetailsActions from './asset-details.actions';
import { IamService } from '../../../shared/services/iam.service';
import { iamServiceSpy } from '@tests';

describe('AssetDetailsEffects', () => {
  let actions$: ReplaySubject<any>;
  let effects: AssetDetailsEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AssetDetailsEffects,
        { provide: IamService, useValue: iamServiceSpy },
        provideMockStore(),
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(AssetDetailsEffects);
  });

  describe('getAssetDetails$', () => {
    beforeEach(() => {
      actions$ = new ReplaySubject(1);
    });

    it('should dispatch success action with asset ', (done) => {
      actions$.next(AssetDetailsActions.getDetails({ assetId: '1' }));
      iamServiceSpy.getAssetById.and.returnValue(of({ id: '1' }));
      effects.getAssetDetails$.subscribe((resultAction) => {
        expect(resultAction).toEqual(
          AssetDetailsActions.getDetailsSuccess({ asset: { id: '1' } })
        );
        done();
      });
    });

    it('should dispatch failure action on thrown error ', (done) => {
      actions$.next(AssetDetailsActions.getDetails({ assetId: '1' }));
      iamServiceSpy.getAssetById.and.returnValue(
        throwError({ message: 'Error' })
      );
      effects.getAssetDetails$.subscribe((resultAction) => {
        expect(resultAction).toEqual(
          AssetDetailsActions.getDetailsFailure({ error: 'Error' })
        );
        done();
      });
    });
  });
});
