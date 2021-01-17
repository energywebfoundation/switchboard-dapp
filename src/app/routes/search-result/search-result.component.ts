import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ENSNamespaceTypes } from 'iam-client-lib';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { ListType } from 'src/app/shared/constants/shared-constants';
import { IamService } from 'src/app/shared/services/iam.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { GovernanceDetailsComponent } from '../applications/governance-view/governance-details/governance-details.component';


const FilterTypes = {
  APP: 'app',
  ORG: 'org'
};

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {
  @ViewChild('detailView', undefined) detailView: GovernanceDetailsComponent;

  FilterTypes = FilterTypes;
  screenWidth: number;
  opened = false;
  data: any;
  
  private _searchList: any[];
  filteredOptions: BehaviorSubject<any[]>;

  searchForm: FormGroup;
  searchTxtFieldValue: string;

  requestedClaims: any[];

  constructor(private activeRoute: ActivatedRoute,
      private loadingService: LoadingService,
      private fb: FormBuilder,
      private iamService: IamService) {
        
  }

  ngOnInit() {
    this._initList();
  }

  private _initList() {
    this.loadingService.show();

    // Initialize Search Field and Options
    this.searchForm = this.fb.group({
      searchTxt: new FormControl(''),
      filterType: new FormControl([FilterTypes.ORG, FilterTypes.APP])
    });
    this.filteredOptions = new BehaviorSubject([]);
    this.searchForm.valueChanges
      .pipe(distinctUntilChanged((a: any, b: any) => a.searchTxt === b.searchTxt && a.filterType === b.filterType))
      .subscribe((value: any) => {
        this.filteredOptions.next(this._filterOrgsAndApps(value.searchTxt, value.filterType));
      });

    this.activeRoute.queryParams.subscribe(async (queryParams: any) => {
      // Get requested claims
      this.requestedClaims = await this.iamService.iam.getRequestedClaims({
        did: this.iamService.iam.getDid()
      });
      
      // Retrieve List - Orgs & Apps
      await this._getOrgsAndApps();

      if (queryParams.keyword) {
        this.searchForm.get('searchTxt').setValue(queryParams.keyword);
      }

      if (queryParams.namespace) {
        this._initView(queryParams.namespace);
      }
      this._manageScreenWidth();
      this.loadingService.hide();
    });
  }

  private _manageScreenWidth() {
    this.screenWidth = window.innerWidth;
    window.onresize = () => {
      // set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
    };

    // Init 
    if (this.screenWidth > 840 && this.data) {
      this.opened = true;
    }
  }

  private _initView(namespace: string) {
    for (let i = 0; i < this._searchList.length; i++) {
      if (this._searchList[i].namespace === namespace) {
        this.data = { 
          type: this._searchList[i].definition && this._searchList[i].definition.orgName ? ListType.ORG : ListType.APP,
          definition: this._searchList[i] 
        };
        break;
      }
    }
  }

  private _filterOrgsAndApps(keyword: any, listType: any): any[] {
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
          return (item.namespace.toLowerCase().includes(word) ||
            (item.definition.description && item.definition.description.toLowerCase().includes(word)) ||
            (item.definition.orgName && item.definition.orgName.toLowerCase().includes(word)) ||
            (item.definition.appName && item.definition.appName.toLowerCase().includes(word))) &&
            ((listType.includes(FilterTypes.ORG) && item.definition.orgName) ||
            (listType.includes(FilterTypes.APP) && item.definition.appName))
        });
      }
    }

    return retVal;
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
    this._searchList = [...orgList, ...appList];
  }

  private _updateData(data: any) {
    if (data) {
      this.data = { 
        type: data.definition && data.definition.orgName ? ListType.ORG : ListType.APP,
        definition: data
      };
      if (this.detailView) {
        this.detailView.setData(this.data);
      }
    }
    else {
      this.data = data;
    }
  }

  viewDetails(data: any, el: HTMLElement) {
    // console.log('view details', data);
    this.opened = true;
    this._updateData(data);

    // Scroll Up
    el.scrollIntoView(true);
    let body = document.getElementsByTagName('app-header');
    if (body.length) {
      body[0].scrollTop -= 78;
    }
  }

  displayFn(selected: any) {
    return selected && selected.name ? selected.name : '';
  }

  search(namespace?: string) {
    this.opened = false;
    this._updateData(undefined);
  }

  onSelectedItem(event: any) {
    // console.log('onSelectedItem', event);
    this.search(event.option.value.namespace);
  }

  updateSearchTxtFieldValue(event: any) {
    this.opened = false;
    if (typeof this.searchForm.value.searchTxt === 'string') {
      this.searchTxtFieldValue = this.searchForm.value.searchTxt;
    }
    else { 
      this.searchTxtFieldValue = this.searchForm.value.searchTxt.option.value.name;
    }
    this._updateData(undefined);
  }

  clearSearchTxt() {
    this.opened = false;
    this.searchTxtFieldValue = '';
    this.searchForm.get('searchTxt').setValue('');
    this._updateData(undefined);
  }

  clearSelectedItem() {
    this.opened = false;
    this._updateData(undefined);
  }

  onChangeFlag(e: any) {
    // console.log(e);
  }
}
