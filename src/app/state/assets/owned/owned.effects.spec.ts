import { TestBed } from '@angular/core/testing';

import { of, ReplaySubject, throwError } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import * as OwnedActions from './owned.actions';
import { iamServiceSpy } from '@tests';
import { OwnedEffects } from './owned.effects';
import { AssetsFacadeService } from '../../../shared/services/assets-facade/assets-facade.service';

describe('OwnedEffects', () => {
  let actions$: ReplaySubject<any>;
  let effects: OwnedEffects;
  const assetFacadeSpy = jasmine.createSpyObj(AssetsFacadeService, [
    'getOwnedAssets',
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OwnedEffects,
        { provide: AssetsFacadeService, useValue: assetFacadeSpy },
        provideMockStore(),
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(OwnedEffects);
  });

  describe('getAssetDetails$', () => {
    beforeEach(() => {
      actions$ = new ReplaySubject(1);
    });

    it('should dispatch success action with asset ', (done) => {
      const asset = {
        id: 'did:ethr:0xc77dcA7fdC0bEA01D755349aA8C0b6EAb70907CA',
        owner: 'did:ethr:0xA028720Bc0cc22d296DCD3a26E7E8AAe73c9B6F3',
        createdAt: '2021-11-18T08:21:45.000Z',
        updatedAt: '2021-11-18T08:21:45.000Z',
      } as any;
      assetFacadeSpy.getOwnedAssets.and.returnValue(of([asset]));
      actions$.next(OwnedActions.getOwnedAssets());
      iamServiceSpy.getAssetById.and.returnValue(of({ id: '1' }));
      effects.getOwnedAssets$.subscribe((resultAction) => {
        expect(resultAction).toEqual(
          OwnedActions.getOwnedAssetsSuccess({
            assets: [
              {
                ...asset,
                createdDate: new Date(asset.createdAt),
                modifiedDate: new Date(asset.updatedAt),
              },
            ],
          })
        );
        done();
      });
    });

    it('should dispatch failure action on thrown error ', (done) => {
      assetFacadeSpy.getOwnedAssets.and.returnValue(
        throwError({ message: 'Error' })
      );
      actions$.next(OwnedActions.getOwnedAssets());
      iamServiceSpy.getAssetById.and.returnValue(
        throwError({ message: 'Error' })
      );
      effects.getOwnedAssets$.subscribe((resultAction) => {
        expect(resultAction).toEqual(
          OwnedActions.getOwnedAssetsFailure({ error: 'Error' })
        );
        done();
      });
    });
  });
});
