import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { ISmartSearch } from './models/smart-search.interface';
import { truthy } from '@operators';
import { SmartSearchService } from './services/smart-search.service';

@Component({
  selector: 'app-smart-search',
  templateUrl: './smart-search.component.html',
  styleUrls: ['./smart-search.component.scss']
})
export class SmartSearchComponent implements AfterViewInit {
  @Input() searchText: FormControl;
  @Input() placeholderSearch: string;
  @Input() searchType: 'default' | 'restrictions' = 'default';

  @Output() searchTextEvent: EventEmitter<ISmartSearch> = new EventEmitter();

  searchForm: FormGroup;
  isLoadingList: boolean;

  public filteredOptions: Observable<any[]>;

  constructor(private smartSearchService: SmartSearchService) {
  }

  controlHasError(errorType: string) {
    return this.searchText.hasError(errorType);
  }

  ngAfterViewInit(): void {
    this.filteredOptions = this.searchText.valueChanges.pipe(
      truthy(),
      debounceTime(1200),
      tap(() => this.isLoadingList = true),
      switchMap((value: string) => this.smartSearchService.searchBy(value)),
      tap(() => this.isLoadingList = false),
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
    if (this.searchText.invalid) {
      return;
    }
    this.searchTextEvent.emit({
      role: this.searchText.value,
      searchType: this.searchType
    });
    this.clearSearchTxt();
  }

  clearSearchTxt(): void {
    this.searchText.reset();
  }

}
