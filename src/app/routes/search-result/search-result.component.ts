/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { OwnedEnrolmentsSelectors } from '@state';
import { Claim, SearchType } from 'iam-client-lib';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  ListType,
  LoadingCount,
} from '../../shared/constants/shared-constants';
import { IamService } from '../../shared/services/iam.service';
import { LoadingService } from '../../shared/services/loading.service';
import { GovernanceDetailsComponent } from '../applications/governance-view/governance-details/governance-details.component';

const FilterTypes = {
  APP: 'App',
  ORG: 'Org',
};

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent implements OnInit {
  @ViewChild('detailView') detailView: GovernanceDetailsComponent;

  FilterTypes = FilterTypes;
  screenWidth: number;
  opened = false;
  data: any;

  filteredOptions: BehaviorSubject<any[]>;

  searchForm: FormGroup;
  searchTxtFieldValue: string;

  isAutolistLoading = {
    requests: [],
    value: false,
  };

  requestedClaims$ = this.store.select(OwnedEnrolmentsSelectors.getEnrolments);

  constructor(
    private activeRoute: ActivatedRoute,
    private loadingService: LoadingService,
    private fb: FormBuilder,
    private iamService: IamService,
    private store: Store
  ) {}

  ngOnInit() {
    this._initList();
  }

  private _initList() {
    this.loadingService.show();

    // Initialize Search Field and Options
    this.searchForm = this.fb.group({
      searchTxt: new FormControl(''),
      filterType: new FormControl([FilterTypes.ORG, FilterTypes.APP]),
    });
    this.filteredOptions = new BehaviorSubject([]);
    this.searchForm.valueChanges
      .pipe(
        debounceTime(1200),
        distinctUntilChanged(
          (a: any, b: any) =>
            a.searchTxt === b.searchTxt && a.filterType === b.filterType
        )
      )
      .subscribe(async (value: any) => {
        const options = await this._filterOrgsAndApps(
          value.searchTxt,
          value.filterType
        );
        this.filteredOptions.next(options);
      });
    this.activeRoute.queryParams.subscribe(async (queryParams: any) => {
      try {
        if (queryParams.keyword) {
          this.searchForm.get('searchTxt').setValue(queryParams.keyword);
        }

        if (queryParams.namespace) {
          await this._initView(queryParams.namespace);
        }
        this._manageScreenWidth();
      } catch (err) {
        console.error(err);
      } finally {
        this.loadingService.hide();
      }
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

  private async _initView(namespace: string) {
    const [foundNamespace] =
      await this.iamService.domainsService.getENSTypesBySearchPhrase(
        namespace,
        [SearchType.App, SearchType.Org]
      );
    if (foundNamespace) {
      this.data = {
        type: (foundNamespace.definition as { orgName?: string }).orgName
          ? ListType.ORG
          : ListType.APP,
        definition: foundNamespace,
      };
    }
  }

  private async _filterOrgsAndApps(
    keyword: any,
    listType: any
  ): Promise<any[]> {
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
              listType
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

  private async _updateData(data: any) {
    if (data) {
      this.data = {
        type:
          data.definition && data.definition.orgName
            ? ListType.ORG
            : ListType.APP,
        definition: data,
      };
      if (this.detailView) {
        await this.detailView.setData(this.data);
      }
    } else {
      this.data = data;
    }
  }

  viewDetails(data: any, el: HTMLElement) {
    this.opened = true;
    this._updateData(data);

    // Scroll Up
    el.scrollIntoView(true);
    const body = document.getElementsByTagName('app-header');
    if (body.length) {
      body[0].scrollTop -= 78;
    }
  }

  displayFn(selected: any) {
    return selected && selected.name ? selected.name : '';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  search(namespace?: string) {
    this.opened = false;
    this._updateData(undefined);
  }

  onSelectedItem(event: any) {
    // console.log('onSelectedItem', event);
    this.search(event.option.value.namespace);
  }

  // eslint-disable-next-line
  updateSearchTxtFieldValue(event: any) {
    this.opened = false;
    if (typeof this.searchForm.value.searchTxt === 'string') {
      this.searchTxtFieldValue = this.searchForm.value.searchTxt;
    } else {
      this.searchTxtFieldValue =
        this.searchForm.value.searchTxt.option.value.name;
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
}
