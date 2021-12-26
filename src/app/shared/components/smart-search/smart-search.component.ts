import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, startWith, switchMap } from 'rxjs/operators';
import { SearchType } from 'iam-client-lib';
import { DomainsFacadeService } from '../../services/domains-facade/domains-facade.service';
import { ISmartSearch } from './models/smart-search.interface';

@Component({
  selector: 'app-smart-search',
  templateUrl: './smart-search.component.html',
  styleUrls: ['./smart-search.component.scss']
})
export class SmartSearchComponent implements AfterViewInit {
  @Input() searchText: FormControl;
  @Input() placeholderSearch: string;
  @Input() fieldName: string;
  @Input() searchType = '';

  @Output() searchTextEvent: EventEmitter<ISmartSearch> = new EventEmitter();

  searchTxtFieldValue: string;
  searchForm: FormGroup;
  isAutolistLoading = {
    requests: [],
    value: false
  };

  public filteredOptions: Observable<any[]>;

  constructor(private domainsFacade: DomainsFacadeService) {
  }

  controlHasError(errorType: string) {
    return this.searchText.hasError(errorType);
  }

  ngAfterViewInit(): void {
    this.filteredOptions = this.searchText.valueChanges.pipe(
      debounceTime(1200),
      startWith(''),
      switchMap(async (value) => await this._filterOrgsAndApps(value))
    );
  }

  displayFn(selected: any) {
    return selected && selected.namespace ? selected.namespace : '';
  }

  async search() {
    this.searchText.updateValueAndValidity();
  }

  updateSearchTxtFieldValue(event: any) {
    if (typeof this.searchText.value === 'string') {
      this.searchTxtFieldValue = this.searchText.value;
    } else {
      this.searchTxtFieldValue = this.searchText.value.option.value.namespace;
    }
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
    this.searchTxtFieldValue = '';
    this.searchText.setValue('');
    this.searchText.setErrors(null);
  }

  private async _filterOrgsAndApps(keyword: any): Promise<any[]> {
    let retVal = [];
    this.isAutolistLoading.value = true;
    try {
      if (keyword) {
        let word;
        if (this.fieldName === 'rolePage') {
          (!keyword.trim && keyword.namespace) ? word = keyword.namespace :
            word = keyword.trim();
        }

        if (word.length > 2) {
          word = word.toLowerCase();
          retVal = await this.domainsFacade.getENSTypesBySearchPhrase(
            word,
            this.fieldName === 'rolePage' ? [SearchType.Role] : [SearchType.App, SearchType.Org]
          );
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
