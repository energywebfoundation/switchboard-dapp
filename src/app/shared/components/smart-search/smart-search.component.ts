import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { SearchType } from 'iam-client-lib';
import { DomainsFacadeService } from '../../services/domains-facade/domains-facade.service';
import { ISmartSearch } from './models/smart-search.interface';
import { truthy } from '@operators';

@Component({
  selector: 'app-smart-search',
  templateUrl: './smart-search.component.html',
  styleUrls: ['./smart-search.component.scss']
})
export class SmartSearchComponent implements AfterViewInit {
  @Input() searchText: FormControl;
  @Input() placeholderSearch: string;
  @Input() fieldName: string;
  @Input() searchType: 'default' | 'restrictions' = 'default';

  @Output() searchTextEvent: EventEmitter<ISmartSearch> = new EventEmitter();

  searchForm: FormGroup;
  isAutolistLoading = {
    requests: [],
    value: false
  };

  public filteredOptions: Observable<any[]>;

  constructor(private domainsFacade: DomainsFacadeService,) {
  }

  controlHasError(errorType: string) {
    return this.searchText.hasError(errorType);
  }

  ngAfterViewInit(): void {
    this.filteredOptions = this.searchText.valueChanges.pipe(
      truthy(),
      debounceTime(1200),
      switchMap(async (value: string) => await this._filterOrgsAndApps(value))
    );
  }

  displayFn(selected: string) {
    return selected ? selected : '';
  }

  async search() {
    this.searchText.updateValueAndValidity();
  }

  showButtons(): boolean {
    return this.searchText.value?.trim()?.length > 2;
  }

  addRole() {
    const valid = this.searchText.valid;

    if (valid) {
      const searchText = this.searchText.value;
      this.searchTextEvent.emit({
        role: searchText,
        searchType: this.searchType
      });
      this.clearSearchTxt();
    }
  }

  clearSearchTxt(): void {
    this.searchText.setValue('');
    this.searchText.setErrors(null);
  }

  private async _filterOrgsAndApps(keyword: any): Promise<string[]> {
    let retVal = [];
    this.isAutolistLoading.value = true;
    try {
      if (keyword) {
        let word;
        if (this.fieldName === 'rolePage') {
          (!keyword.trim && keyword.namespace) ? word = keyword.namespace :
            word = keyword.trim();
        }

        if (word?.length > 2) {
          word = word.toLowerCase();
          retVal = (await this.domainsFacade.getENSTypesBySearchPhrase(
            word,
            this.fieldName === 'rolePage' ? [SearchType.Role] : [SearchType.App, SearchType.Org]
          )).map((item) => item.namespace);
          this.isAutolistLoading.value = false;
        }
      }
    } catch (e) {
      console.error(e);
      this.isAutolistLoading.value = false;
    }
    return retVal;
  }
}
