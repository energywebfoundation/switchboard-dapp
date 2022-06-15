import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { ISmartSearch } from './models/smart-search.interface';
import { truthy } from '@operators';
import { SmartSearchService } from './services/smart-search.service';
import { SmartSearchType } from './models/smart-search-type.enum';
import { IApp, IRole, SearchType } from 'iam-client-lib';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete/autocomplete';
import { IOrganization } from 'iam-client-lib/dist/src/modules/domains/domains.types';

@Component({
  selector: 'app-smart-search',
  templateUrl: './smart-search.component.html',
  styleUrls: ['./smart-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SmartSearchComponent implements AfterViewInit {
  @Input() searchText: FormControl = new FormControl('');
  @Input() placeholderSearch: string;
  @Input() searchType: SmartSearchType = SmartSearchType.Default;
  @Input() searchBy: SearchType[] = [SearchType.Role];

  @Output() add: EventEmitter<ISmartSearch> = new EventEmitter();
  @Output() selected: EventEmitter<{ namespace: string; keyword: string }> =
    new EventEmitter();

  isLoadingList: boolean;
  private searchTxtFieldValue: string;

  public filteredOptions: Observable<(IApp | IRole | IOrganization)[]>;

  constructor(private smartSearchService: SmartSearchService) {}

  ngAfterViewInit(): void {
    this.filteredOptions = this.searchText.valueChanges.pipe(
      truthy(),
      debounceTime(1200),
      tap(() => (this.isLoadingList = true)),
      switchMap((value: string) =>
        this.smartSearchService.searchBy(value, this.searchBy)
      ),
      tap(() => (this.isLoadingList = false))
    );
  }

  displayFn(selected: string): string {
    return selected ? selected : '';
  }

  search(): void {
    this.searchText.updateValueAndValidity();
  }

  autocompleteSelectionHandler(event: MatAutocompleteSelectedEvent) {
    this.selectionHandler(event.option.value);
    if (this.isAdding) {
      this.addSelection();
    }
  }
  selectionHandler(namespace?: string) {
    this.selected.emit({
      namespace,
      keyword: this.searchTxtFieldValue,
    });
  }

  get isAdding(): boolean {
    return this.searchType === SmartSearchType.Add;
  }

  get isDefault(): boolean {
    return this.searchType === SmartSearchType.Default;
  }

  showButtons(): boolean {
    return this.searchText?.value?.trim()?.length > 2;
  }

  addSelection(): void {
    if (this.searchText.invalid) {
      return;
    }
    this.add.emit({
      value: this.searchText.value,
      searchType: this.searchType,
    });
    this.clear();
  }

  clear(): void {
    this.searchText.setValue('');
  }

  updateSearchTxtFieldValue() {
    this.searchTxtFieldValue = this.searchText.value;
  }
}
