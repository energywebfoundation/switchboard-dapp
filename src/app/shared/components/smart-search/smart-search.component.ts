import { AfterViewInit, Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, startWith, switchMap } from 'rxjs/operators';
import { IamService } from '../../services/iam.service';
import { IRole } from 'iam-client-lib';

interface ISmartSearch {
    role: IRole;
    searchType: string;
}
  
@Component({
    selector: 'app-smart-search',
    templateUrl: './smart-search.component.html',
    styleUrls: ['./smart-search.component.scss']
})
export class SmartSearchComponent implements OnInit, AfterViewInit {
    @Input() searchText: FormControl;
    @Input() placeholderSearch: string;
    @Input() fieldName: string;
    @Input() searchType = "";

    @Output() searchTextEvent: EventEmitter<ISmartSearch> = new EventEmitter();

    searchTxtFieldValue: string;
    searchForm: FormGroup;
    isAutolistLoading = {
        requests: [],
        value: false
    };

    public filteredOptions: Observable<any[]>;

    constructor(private route: Router,
        private iamService: IamService) {
    }

    ngOnInit(): void {
    }

    controlHasError(errorType: string) {
        return this.searchText.hasError(errorType);
    }
    
    ngAfterViewInit(): void {
        this.filteredOptions = this.searchText.valueChanges.pipe(
            debounceTime(1200),
            startWith(undefined),
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
                    retVal = await this.iamService.iam.getENSTypesBySearchPhrase({
                        search: word,
                        types: this.fieldName === 'rolePage' ? [ 'Role'] : ['App', 'Org']
                    });
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
