import { AfterViewInit, Component } from '@angular/core';
import { IamService } from 'src/app/shared/services/iam.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, startWith, switchMap } from 'rxjs/operators';
import { WalletProvider } from 'iam-client-lib';
import { LoadingCount } from 'src/app/shared/constants/shared-constants';
import { Store } from '@ngrx/store';
import { loadUserClaims } from '../../state/user-claim/user.actions';
import * as userSelectors from '../../state/user-claim/user.selectors';
import { UserClaimState } from '../../state/user-claim/user.reducer';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {
  private readonly walletProvider: WalletProvider = undefined;

  public filteredOptions: Observable<any[]>;
  public searchForm: FormGroup;
  searchTxtFieldValue: string;
  isAutolistLoading = {
    requests: [],
    value: false
  };

  userName$ = this.store.select(userSelectors.getUserName);
  userDid$ = this.store.select(userSelectors.getDid);

  constructor(
    private iamService: IamService,
    private route: Router,
    private activeRoute: ActivatedRoute,
    private loadingService: LoadingService,
    private fb: FormBuilder,
    private store: Store<UserClaimState>
  ) {
    // Init Search
    this.searchForm = fb.group({
      searchTxt: new FormControl('')
    });
    this.filteredOptions = this.searchForm.get('searchTxt').valueChanges.pipe(
      debounceTime(1200),
      startWith(undefined),
      switchMap(async (value) => await this._filterOrgsAndApps(value))
    );
  }

  ngAfterViewInit(): void {
    this.activeRoute.queryParams.subscribe(async (queryParams: any) => {
      let returnUrl;
      this.loadingService.show();

      // Check Login
      if (this.iamService.iam.isSessionActive()) {
        await this.iamService.login();

        // Check if returnUrl is available or just redirect to dashboard
        if (queryParams && queryParams.returnUrl) {
          returnUrl = queryParams.returnUrl;
        }
      } else {
        // Redirect to login screen if user  is not yet logged-in
        returnUrl = '/welcome';
      }

      // Setup User Data
      await this._setupUser();
      this.store.dispatch(loadUserClaims());
      // Redirect to actual screen
      if (returnUrl) {
        let timeout$ = setTimeout(() => {
          this.loadingService.hide();
          this.route.navigateByUrl(returnUrl);
          clearTimeout(timeout$);
        }, 30);
      } else {
        this.loadingService.hide();
      }
    });
  }

  private async _setupUser() {
    // Setup User Data
    await this.iamService.setupUser();
  }

  private async _filterOrgsAndApps(keyword: any): Promise<any[]> {
    let retVal = [];
    this.loadingService.updateLocalLoadingFlag(this.isAutolistLoading, LoadingCount.UP);

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
          retVal = await this.iamService.iam.getENSTypesBySearchPhrase({
            search: word,
            types: ['App', 'Org']
          });
        }
      }
    }
    catch (e) {
      console.error(e);
    }
    finally {
      this.loadingService.updateLocalLoadingFlag(this.isAutolistLoading, LoadingCount.DOWN);
    }

    return retVal;
  }

  displayFn(selected: any) {
    return selected && selected.name ? selected.name : '';
  }

  search(namespace?: string) {
    if (!this.isAutolistLoading.value) {
      this.route.navigate(['search-result'], {
        queryParams: { keyword: this.searchTxtFieldValue, namespace: namespace }
      });
    }
  }

  onSelectedItem(event: any) {
    // console.log('onSelectedItem', event);
    this.search(event.option.value.namespace);
  }

  updateSearchTxtFieldValue(event: any) {
    if (typeof this.searchForm.value.searchTxt === 'string') {
      this.searchTxtFieldValue = this.searchForm.value.searchTxt;
    } else {
      this.searchTxtFieldValue = this.searchForm.value.searchTxt.option.value.name;
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

  clearSearchTxt() {
    this.searchTxtFieldValue = '';
    this.searchForm.get('searchTxt').setValue('');
  }
}
