import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { IamService } from '../../shared/services/iam.service';
import { finalize, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { ENSNamespaceTypes, IOrganization } from 'iam-client-lib';
import { StakingPoolServiceFacade } from '../../shared/services/staking/staking-pool-service-facade';
import { createSub, getList, getListSuccess, setHistory, setHistorySuccess } from './organization.actions';
import { forkJoin } from 'rxjs';
import { LoadingService } from '../../shared/services/loading.service';
import {
  NewOrganizationComponent,
  ViewType
} from '../../routes/applications/new-organization/new-organization.component';
import { MatDialog } from '@angular/material/dialog';
import { SwitchboardToastrService } from '../../shared/services/switchboard-toastr.service';
import { truthy } from '../../operators/truthy/truthy';
import { getHierarchy } from './organization.selectors';

@Injectable()
export class OrganizationEffects {

  getList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getList),
      tap(() => this.loadingService.show()),
      switchMap(() => forkJoin([
        this.iamService.getENSTypesByOwner$(ENSNamespaceTypes.Organization),
        this.stakingService.allServices()
      ])),
      map(([organizations, providers]) => {
        const servicesNames = providers.map((service) => service.org);
        return (organizations as IOrganization[]).map((org: IOrganization) => ({
          ...org,
          isProvider: servicesNames.includes(org.namespace)
        }));
      }),
      map((list) => {
        console.log(list);
        this.loadingService.hide();
        return getListSuccess({list});
      })
    )
  );

  updateHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setHistory),
      tap(() => this.loadingService.show()),
      switchMap(({element}) => this.iamService.getOrgHistory(element.namespace).pipe(
        map((org) => {
          if (org.subOrgs && org.subOrgs.length) {
            return setHistorySuccess({history: org.subOrgs, element: org});
          } else {
            this.toastr.warning('Sub-Organization List is empty.', 'Sub-Organization');
            return setHistorySuccess({history: [], element: null});
          }
        }),
        // catchError((e) => {
        //   console.error(e);
        //   this.toastr.error('An error has occured while retrieving the list.', 'Sub-Organization');
        //   return e;
        // }),
        finalize(() => this.loadingService.hide())
      ))
    )
  );

  createSubOrganization$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createSub),
      map(({org}) => {
        return this.dialog.open(NewOrganizationComponent, {
          width: '600px',
          data: {
            viewType: ViewType.NEW,
            parentOrg: JSON.parse(JSON.stringify(org)),
            owner: org.owner
          },
          maxWidth: '100%',
          disableClose: true
        }).afterClosed();
      }),
      withLatestFrom(
        this.store.select(getHierarchy)
      ),
      switchMap(([dialog, hierarchy]) => dialog.pipe(truthy(), map(() => {
        const lastElement = hierarchy[hierarchy.length - 1];
        return setHistory({element: lastElement});
      })))
    )
  );

  constructor(private actions$: Actions,
              private store: Store,
              private iamService: IamService,
              private stakingService: StakingPoolServiceFacade,
              private loadingService: LoadingService,
              private dialog: MatDialog,
              private toastr: SwitchboardToastrService
  ) {
  }

}
