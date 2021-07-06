import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, startWith, switchMap } from 'rxjs/operators';
import { IamService } from '../../services/iam.service';

@Component({
    selector: 'app-smart-search',
    templateUrl: './smart-search.component.html',
    styleUrls: ['./smart-search.component.scss']
})
export class SmartSearchComponent implements OnInit, AfterViewInit {
    @Input() searchText: FormControl;
    @Input() placeholderSearch: string;
    @Input() fieldName: string;

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

  clearSearchTxt(): void {
    this.searchTxtFieldValue = '';
    this.searchText.setValue('');
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
