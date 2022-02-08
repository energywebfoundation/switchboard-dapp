import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import * as OrganizationActions from './organization.actions';
import { Observable, of } from 'rxjs';
import {
  NewOrganizationComponent,
  ViewType,
} from '../../../routes/applications/new-organization/new-organization.component';
import { MatDialog } from '@angular/material/dialog';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { truthy } from '@operators';
import { OrganizationService } from './services/organization.service';
import * as OrganizationSelectors from './organization.selectors';
import { OrganizationProvider } from './models/organization-provider.interface';

@Injectable()
export class OrganizationEffects {
  getList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrganizationActions.getList),
      switchMap(() => this.orgService.getOrganizationList()),
      map((list: OrganizationProvider[]) =>
        OrganizationActions.getListSuccess({ list })
      ),
      catchError((err) => {
        console.error(err);
        this.toastr.error(
          'Something went wrong while getting list of organizations',
          'Organization'
        );
        return of(OrganizationActions.getListFailure({ error: err.message }));
      })
    )
  );

  updateHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrganizationActions.setHistory),
      switchMap(({ element }) =>
        this.orgService.getHistory(element.namespace).pipe(
          map((org) => {
            if (org.subOrgs && org.subOrgs.length) {
              return OrganizationActions.setHistorySuccess({
                history: org.subOrgs.filter((item) => item.owner === org.owner),
                element: org,
              });
            } else {
              this.toastr.warning(
                'Sub-Organization List is empty.',
                'Sub-Organization'
              );
              return OrganizationActions.setHistorySuccess({
                history: [],
                element: null,
              });
            }
          }),
          catchError((e) => {
            console.error(e);
            this.toastr.error(
              'An error has occured while retrieving the list.',
              'Sub-Organization'
            );
            return of(
              OrganizationActions.setHistoryFailure({ error: e.message })
            );
          })
        )
      )
    )
  );

  createSubOrganizationForParent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrganizationActions.createSubForParent),
      withLatestFrom(
        this.store.select(OrganizationSelectors.getLastHierarchyOrg)
      ),
      map(([, org]) => OrganizationActions.createSub({ org }))
    )
  );

  createSubOrganization$ = createEffect(() => {
    let organization;

    return this.actions$.pipe(
      ofType(OrganizationActions.createSub),
      map(({ org }) => {
        organization = org;
        return this.dialog
          .open(NewOrganizationComponent, {
            width: '600px',
            data: {
              viewType: ViewType.NEW,
              parentOrg: JSON.parse(JSON.stringify(org)),
              owner: org.owner,
            },
            maxWidth: '100%',
            disableClose: true,
          })
          .afterClosed();
      }),
      switchMap((dialog: Observable<boolean>) =>
        dialog.pipe(
          truthy(),
          map(() => OrganizationActions.setHistory({ element: organization }))
        )
      )
    );
  });

  updateSelectedOrganizationAfterEdit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrganizationActions.updateSelectedOrgAfterEdit),
      withLatestFrom(
        this.store.select(OrganizationSelectors.getLastHierarchyOrg)
      ),
      map(([, lastOrg]) => {
        if (lastOrg) {
          return OrganizationActions.setHistory({ element: lastOrg });
        }
        return OrganizationActions.getList();
      })
    )
  );

  updateSelectedOrganizationAfterTransfer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        OrganizationActions.updateSelectedOrgAfterTransfer,
        OrganizationActions.updateSelectedOrgAfterRemoval
      ),
      withLatestFrom(
        this.store.select(OrganizationSelectors.getLastHierarchyOrg),
        this.store.select(OrganizationSelectors.getHierarchyLength)
      ),
      map(([, lastOrg, hierarchyLength]) => {
        if (hierarchyLength) {
          return OrganizationActions.setHistory({ element: lastOrg });
        }
        return OrganizationActions.getList();
      })
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private orgService: OrganizationService,
    private dialog: MatDialog,
    private toastr: SwitchboardToastrService
  ) {}
}
