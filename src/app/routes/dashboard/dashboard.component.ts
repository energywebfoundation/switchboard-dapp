/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, Component } from '@angular/core';
import { IamService } from '../../shared/services/iam.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '../../shared/services/loading.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import {
  debounceTime,
  filter,
  map,
  startWith,
  switchMap,
  take,
} from 'rxjs/operators';
import { ProviderType, SearchType } from 'iam-client-lib';
import { LoadingCount } from '../../shared/constants/shared-constants';
import { Store } from '@ngrx/store';
import * as userSelectors from '../../state/user-claim/user.selectors';
import * as AuthActions from '../../state/auth/auth.actions';
import { LayoutActions, SettingsSelectors } from '@state';
import { UrlService } from 'src/app/shared/services/url-service/url.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements AfterViewInit {
  private readonly walletProvider: ProviderType = undefined;

  public filteredOptions: Observable<any[]>;
  public searchForm: FormGroup;
  searchTxtFieldValue: string;
  isAutolistLoading = {
    requests: [],
    value: false,
  };

  userName$ = this.store.select(userSelectors.getUserName);
  userDid$ = this.store.select(userSelectors.getDid);
  isExperimentalEnabled$ = this.store.select(
    SettingsSelectors.isExperimentalEnabled
  );

  constructor(
    private iamService: IamService,
    private route: Router,
    private activeRoute: ActivatedRoute,
    private loadingService: LoadingService,
    private fb: FormBuilder,
    private store: Store,
    private urlService: UrlService
  ) {
    // Init Search
    this.searchForm = fb.group({
      searchTxt: new FormControl(''),
    });
    this.filteredOptions = this.searchForm.get('searchTxt').valueChanges.pipe(
      debounceTime(1200),
      startWith(''),
      switchMap(async (value) => await this._filterOrgsAndApps(value))
    );
  }

  ngAfterViewInit(): void {
    this.activeRoute.queryParams.subscribe(async (params: any) => {
        if (params._oob) {
            this.goToVerifiablePresentation(params._oob);
        }
    }) 
    
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

  private async _filterOrgsAndApps(keyword: any): Promise<any[]> {
    let retVal = [];
    this.loadingService.updateLocalLoadingFlag(
      this.isAutolistLoading,
      LoadingCount.UP
    );

    try {
      if (keyword) {
        let word;
        if (!keyword.trim && keyword.name) {
          word = keyword.name;
        } else {
          word = keyword.trim();
        }

        if (word.length > 2) {
          word = word.toLowerCase();
          retVal =
            await this.iamService.domainsService.getENSTypesBySearchPhrase(
              word,
              [SearchType.App, SearchType.Org]
            );
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.loadingService.updateLocalLoadingFlag(
        this.isAutolistLoading,
        LoadingCount.DOWN
      );
    }

    return retVal;
  }

  displayFn(selected: any) {
    return selected && selected.name ? selected.name : '';
  }

  search(namespace?: string) {
    if (!this.isAutolistLoading.value) {
      this.route.navigate(['search-result'], {
        queryParams: { keyword: this.searchTxtFieldValue, namespace },
      });
    }
  }

  onSelectedItem(event: any) {
    // console.log('onSelectedItem', event);
    this.search(event.option.value.namespace);
  }

  // eslint-disable-next-line
  updateSearchTxtFieldValue(event: any) {
    if (typeof this.searchForm.value.searchTxt === 'string') {
      this.searchTxtFieldValue = this.searchForm.value.searchTxt;
    } else {
      this.searchTxtFieldValue =
        this.searchForm.value.searchTxt.option.value.name;
    }
  }

  goToGovernance() {
    this.route.navigate(['governance']);
  }

  goToEnrolment() {
    this.route.navigate(['enrolment']);
  }

  goToAssets() {
    this.route.navigate(['assets']);
  }

  goToVerifiablePresentation(oob: string) {
    this.route.navigate(['vp'], {
        queryParams: {_oob: oob},
      });
  }

  clearSearchTxt() {
    this.searchTxtFieldValue = '';
    this.searchForm.get('searchTxt').setValue('');
  }
}
