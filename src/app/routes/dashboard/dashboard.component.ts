import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, take } from 'rxjs/operators';
import { SearchType } from 'iam-client-lib';
import { Store } from '@ngrx/store';
import * as userSelectors from '../../state/user-claim/user.selectors';
import * as AuthActions from '../../state/auth/auth.actions';
import { LayoutActions, SettingsSelectors } from '@state';
import { RouterConst } from '../router-const';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements AfterViewInit {
  userName$ = this.store.select(userSelectors.getUserName);
  userDid$ = this.store.select(userSelectors.getDid);
  isExperimentalEnabled$ = this.store.select(
    SettingsSelectors.isExperimentalEnabled
  );

  constructor(
    private route: Router,
    private activeRoute: ActivatedRoute,
    private store: Store
  ) {}

  ngAfterViewInit(): void {
  
    this.activeRoute.queryParams
      .pipe(
        filter((queryParams) => queryParams?.returnUrl),
        map((params) => params.returnUrl),
        take(1)
      )
      .subscribe((redirectUrl) => {
        this.store.dispatch(LayoutActions.setRedirectUrl({ url: redirectUrl }));
      });
      this.store.dispatch(AuthActions.reinitializeAuth());
  }

  searchBy() {
    return [SearchType.App, SearchType.Org];
  }

  goToSearchResult(namespace?: string, keyword?: string) {
    this.route.navigate([RouterConst.SearchResult], {
      queryParams: { keyword, namespace },
    });
  }

  goToGovernance() {
    this.route.navigate([RouterConst.Governance]);
  }

  goToEnrolment() {
    this.route.navigate([RouterConst.Enrolment]);
  }

  goToAssets() {
    this.route.navigate([RouterConst.Assets]);
  }
}
