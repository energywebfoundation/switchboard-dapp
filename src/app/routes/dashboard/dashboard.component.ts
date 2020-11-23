import { Component, OnInit } from '@angular/core';
import { IamService, LoginType } from 'src/app/shared/services/iam.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ENSNamespaceTypes } from 'iam-client-lib';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public accountDid = "";
  public userName = "";
  private _loginStatus = undefined;

  private _searchList: any[];
  public filteredOptions: Observable<any[]>;
  public searchForm: FormGroup;
  searchTxtFieldValue: string;

  constructor(private iamService: IamService, 
    private route: Router,
    private activeRoute: ActivatedRoute,
    private loadingService: LoadingService,
    private toastr: ToastrService,
    private fb: FormBuilder) { 
      this.loadingService.show();

      // Init Search
      this.searchForm = fb.group({
        searchTxt: new FormControl('')
      });
      this.filteredOptions = this.searchForm.get('searchTxt')
        .valueChanges.pipe(
          startWith(undefined),
          map(value => this._filterOrgsAndApps(value))
        );

      // Check Login Status
      this._loginStatus = this.iamService.getLoginStatus();
  }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe(async (queryParams: any) => {

      let returnUrl = undefined;

      // Check Login
      if (this._loginStatus) {
        console.log(this._loginStatus);
        if (this._loginStatus === LoginType.LOCAL) {
          console.log('local > login');

          // Set metamask extension options if connecting with metamask extension
          let useMetamaskExtension = undefined;
          if (window.localStorage.getItem('METAMASK_EXT_CONNECTED')) {
            useMetamaskExtension = true;
          }

          // Proceed Login
          await this.iamService.login(useMetamaskExtension);
        }

        // Check if returnUrl is available or just redirect to dashboard
        if (queryParams && queryParams.returnUrl) {
          returnUrl = queryParams.returnUrl;
        }
      }
      else {
        // Redirect to login screen if user  is not yet logged-in
        returnUrl = '/welcome';
      }
      
      // Redirect to actual screen
      if (returnUrl) {
        this.loadingService.hide();
        this.route.navigateByUrl(returnUrl);
      }
      else {
        // Init Orgs & Apps
        await this._getOrgsAndApps();
        this.loadingService.hide();

        // Setup User Data
        this._setupUser();

        // Stay in current screen and display user name if available
        this.iamService.userProfile.subscribe((data: any) => {
          if (data && data.name) {
            this.userName = data.name;
          }
        });
      }
    });
  }

  private async _setupUser() {
    // Format DID
    let did = this.iamService.iam.getDid();
    this.accountDid = `${did.substr(0, 15)}...${did.substring(did.length - 5)}`;

    // Setup User Data
    await this.iamService.setupUser();
  }

  private async _getOrgsAndApps() {
    let orgList = await this.iamService.iam.getENSTypesBySearchPhrase({
      search: '',
      type: ENSNamespaceTypes.Organization
    });

    let appList = await this.iamService.iam.getENSTypesBySearchPhrase({
      search: '',
      type: ENSNamespaceTypes.Application
    });

    console.log('orgList', orgList);
    console.log('appList', appList);
    this._searchList = [...orgList, ...appList];

    console.log('searchList', this._searchList);
  }

  private _filterOrgsAndApps(keyword: any): any[] {
    let retVal = [];

    if (keyword) {
      let word = undefined;
      if (!keyword.trim && keyword.name) {
        word = keyword.name;
      }
      else {
        word = keyword.trim();
      }

      if (word.length > 2) {
        word = word.toLowerCase();
        retVal = this._searchList.filter((item: any) => {
          return item.namespace.toLowerCase().includes(word) ||
            (item.definition.description && item.definition.description.toLowerCase().includes(word)) ||
            (item.definition.orgName && item.definition.orgName.toLowerCase().includes(word)) ||
            (item.definition.appName && item.definition.appName.toLowerCase().includes(word))
        });
      }
    }

    return retVal;
  }

  displayFn(selected: any) {
    return selected && selected.name ? selected.name : '';
  }

  search(namespace?: string) {
    this.route.navigate(['search-result'], { queryParams: { keyword: this.searchTxtFieldValue, namespace: namespace } });
  }

  onSelectedItem(event: any) {
    console.log('onSelectedItem', event);
    this.search(event.option.value.namespace);
  }

  updateSearchTxtFieldValue(event: any) {
    if (typeof this.searchForm.value.searchTxt === 'string') {
      this.searchTxtFieldValue = this.searchForm.value.searchTxt;
    }
    else { 
      this.searchTxtFieldValue = this.searchForm.value.searchTxt.option.value.name;
    }
  }

  goToGovernance() {
    this.route.navigate(['governance']); 
  }

  goToEnrolment() {
    this.route.navigate(['enrolment']); 
  }

  copyToClipboard() {
    let listener = (e: ClipboardEvent) => {
      let clipboard = e.clipboardData || window["clipboardData"];
      clipboard.setData("text", this.iamService.iam.getDid());
      e.preventDefault();
    }

    document.addEventListener("copy", listener, false)
    document.execCommand("copy");
    document.removeEventListener("copy", listener, false);

    this.toastr.success('User DID is copied to clipboard.');
  }

  clearSearchTxt() {
    this.searchTxtFieldValue = '';
    this.searchForm.get('searchTxt').setValue('');
  }
}
