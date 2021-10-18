import { TestBed } from '@angular/core/testing';

import { of, ReplaySubject, throwError } from 'rxjs';

import { ArbitraryEffects } from './arbitrary.effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ArbitraryState } from './arbitrary.reducer';
import * as ArbitraryActions from './arbitrary.actions';
import { toastrSpy } from '@tests';
import { ArbitraryService } from './services/arbitrary.service';
import { SwitchboardToastrService } from '../../shared/services/switchboard-toastr.service';

describe('ArbitraryEffects', () => {

  let actions$: ReplaySubject<any>;
  let effects: ArbitraryEffects;
  let store: MockStore<ArbitraryState>;
  const arbitraryServiceSpy = jasmine.createSpyObj('ArbitraryService', ['getList']);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ArbitraryEffects,
        {provide: ArbitraryService, useValue: arbitraryServiceSpy},
        {provide: SwitchboardToastrService, useValue: toastrSpy},
        provideMockStore(),
        provideMockActions(() => actions$),
      ],
    });
    store = TestBed.inject(MockStore);

    effects = TestBed.inject(ArbitraryEffects);
  });

  describe('test', () => {
    beforeEach(() => {
      actions$ = new ReplaySubject(1);
    });

    it('should dispatch failure action after getting an error', (done) => {
      actions$.next(ArbitraryActions.getList);
      arbitraryServiceSpy.getList.and.returnValue(throwError({message: 'message'}));

      effects.getList$.subscribe(resultAction => {
          expect(toastrSpy.error).toHaveBeenCalled();
          expect(resultAction).toEqual(ArbitraryActions.getListFailure({error: 'message'}));
          done();
        }
      );
    });

    it('should dispatch success action after getting a list of roles', (done) => {
      actions$.next(ArbitraryActions.getList);
      arbitraryServiceSpy.getList.and.returnValue(of([{}, {}]));

      effects.getList$.subscribe(resultAction => {
          expect(resultAction).toEqual(ArbitraryActions.getListSuccess({list: [{}, {}]}));
          done();
        }
      );
    });

  });

});
