import { TestBed, waitForAsync } from '@angular/core/testing';

import { of, ReplaySubject, throwError } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { OrganizationEffects } from './organization.effects';
import { OrganizationService } from './services/organization.service';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { MatDialog } from '@angular/material/dialog';
import * as OrganizationActions from './organization.actions';
import * as OrganizationSelectors from './organization.selectors';

describe('OrganizationEffects', () => {
  const organizationServiceSpy = jasmine.createSpyObj('OrganizationService', [
    'getOrganizationList',
    'getHistory',
  ]);
  const toastrSpy = jasmine.createSpyObj('SwitchboardToastrService', [
    'success',
    'error',
  ]);
  const dialogSpy = jasmine.createSpyObj('MatDialog', ['closeAll', 'open']);
  let actions$: ReplaySubject<any>;
  let effects: OrganizationEffects;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OrganizationEffects,
        { provide: OrganizationService, useValue: organizationServiceSpy },
        { provide: SwitchboardToastrService, useValue: toastrSpy },
        { provide: MatDialog, useValue: dialogSpy },
        provideMockStore(),
        provideMockActions(() => actions$),
      ],
    });
    store = TestBed.inject(MockStore);

    effects = TestBed.inject(OrganizationEffects);
  });

  describe('getList$', () => {
    beforeEach(() => {
      actions$ = new ReplaySubject(1);
    });

    it('should dispatch success action', waitForAsync(() => {
      actions$.next(OrganizationActions.getList());
      organizationServiceSpy.getOrganizationList.and.returnValue(of([]));

      effects.getList$.subscribe((resultAction) => {
        expect(resultAction).toEqual(
          OrganizationActions.getListSuccess({ list: [] })
        );
      });
    }));

    it('should dispatch failure action', waitForAsync(() => {
      actions$.next(OrganizationActions.getList());
      organizationServiceSpy.getOrganizationList.and.returnValue(
        throwError({ message: 'error' })
      );

      effects.getList$.subscribe((resultAction) => {
        expect(toastrSpy.error).toHaveBeenCalled();
        expect(resultAction).toEqual(
          OrganizationActions.getListFailure({ error: 'error' })
        );
      });
    }));
  });

  describe('updateHistory$', () => {
    beforeEach(() => {
      actions$ = new ReplaySubject(1);
    });

    it('should dispatch success actions with history and organization', waitForAsync(() => {
      actions$.next(
        OrganizationActions.setHistory({
          element: { namespace: 'test' } as any,
        })
      );
      organizationServiceSpy.getHistory.and.returnValue(
        of({ namespace: 'test', subOrgs: [{ namespace: 'suborg' }] })
      );

      effects.updateHistory$.subscribe((resultAction) => {
        expect(resultAction).toEqual(
          OrganizationActions.setHistorySuccess({
            history: [{ namespace: 'suborg' } as any],
            element: {
              namespace: 'test',
              subOrgs: [{ namespace: 'suborg' }],
            } as any,
          })
        );
      });
    }));
    it('should filter not owned organizations', waitForAsync(() => {
      actions$.next(
        OrganizationActions.setHistory({
          element: { namespace: 'test' } as any,
        })
      );
      organizationServiceSpy.getHistory.and.returnValue(
        of({
          namespace: 'test',
          owner: '123',
          subOrgs: [
            { namespace: 'suborg', owner: '123' },
            { namespace: 'suborg2', owner: '321' },
          ],
        })
      );

      effects.updateHistory$.subscribe((resultAction) => {
        expect(resultAction).toEqual(
          OrganizationActions.setHistorySuccess({
            history: [{ namespace: 'suborg', owner: '123' } as any],
            element: {
              namespace: 'test',
              owner: '123',
              subOrgs: [
                { namespace: 'suborg', owner: '123' },
                { namespace: 'suborg2', owner: '321' },
              ],
            } as any,
          })
        );
      });
    }));

    it('should dispatch failure action', waitForAsync(() => {
      actions$.next(
        OrganizationActions.setHistory({
          element: { namespace: 'test' } as any,
        })
      );
      organizationServiceSpy.getHistory.and.returnValue(
        throwError({ message: 'error' })
      );

      effects.updateHistory$.subscribe((resultAction) => {
        expect(toastrSpy.error).toHaveBeenCalled();
        expect(resultAction).toEqual(
          OrganizationActions.setHistoryFailure({ error: 'error' })
        );
      });
    }));
  });

  describe('updateSelectedOrganizationAfterEdit$', () => {
    beforeEach(() => {
      actions$ = new ReplaySubject(1);
    });

    it('should get organization list when updating main organizations', waitForAsync(() => {
      actions$.next(OrganizationActions.updateSelectedOrgAfterEdit());
      store.overrideSelector(
        OrganizationSelectors.getLastHierarchyOrg,
        undefined
      );
      effects.updateSelectedOrganizationAfterEdit$.subscribe((resultAction) => {
        expect(resultAction).toEqual(OrganizationActions.getList());
      });
    }));

    it('should get history of organization when updating sub organization', waitForAsync(() => {
      actions$.next(OrganizationActions.updateSelectedOrgAfterEdit());
      store.overrideSelector(OrganizationSelectors.getLastHierarchyOrg, {
        namespace: 'test',
      } as any);
      effects.updateSelectedOrganizationAfterEdit$.subscribe((resultAction) => {
        expect(resultAction).toEqual(
          OrganizationActions.setHistory({
            element: { namespace: 'test' } as any,
          })
        );
      });
    }));
  });

  describe('updateSelectedOrganizationAfterTransfer$', () => {
    beforeEach(() => {
      actions$ = new ReplaySubject(1);
    });

    it('should get organization list when transferring main organizations', waitForAsync(() => {
      actions$.next(OrganizationActions.updateSelectedOrgAfterEdit());
      store.overrideSelector(
        OrganizationSelectors.getLastHierarchyOrg,
        undefined
      );
      store.overrideSelector(OrganizationSelectors.getHierarchyLength, 0);
      effects.updateSelectedOrganizationAfterEdit$.subscribe((resultAction) => {
        expect(resultAction).toEqual(OrganizationActions.getList());
      });
    }));

    it('should get history of organization when transferring sub organization', waitForAsync(() => {
      actions$.next(OrganizationActions.updateSelectedOrgAfterEdit());
      store.overrideSelector(OrganizationSelectors.getLastHierarchyOrg, {
        namespace: 'test',
      } as any);
      store.overrideSelector(OrganizationSelectors.getHierarchyLength, 1);
      effects.updateSelectedOrganizationAfterEdit$.subscribe((resultAction) => {
        expect(resultAction).toEqual(
          OrganizationActions.setHistory({
            element: { namespace: 'test' } as any,
          })
        );
      });
    }));
  });

  describe('createSubOrganization$', () => {
    beforeEach(() => {
      actions$ = new ReplaySubject(1);
    });

    it('should dispatch setHistory action after closing dialog when successfully created a sub org', waitForAsync(() => {
      actions$.next(
        OrganizationActions.createSub({
          org: { namespace: 'parentOrg' } as any,
        })
      );
      dialogSpy.open.and.returnValue({ afterClosed: () => of(true) });

      effects.createSubOrganization$.subscribe((resultAction) => {
        expect(resultAction).toEqual(
          OrganizationActions.setHistory({
            element: { namespace: 'parentOrg' } as any,
          })
        );
      });
    }));
  });
});
