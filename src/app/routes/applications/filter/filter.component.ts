import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Filters } from '../../../state/governance/models/filters';

export interface FilteredData {
  organization: string;
  application: string;
  role: string;
}

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  @Input() isFilterShown: boolean;

  @Input() set filters(data: Filters) {
    if (!data) {
      return;
    }

    this.filterForm.patchValue(data);
  }

  @Input() showOrgFilter = false;
  @Input() showAppFilter = false;
  @Input() showRoleFilter = false;
  @Output() filtersChange = new EventEmitter<FilteredData>();
  filterForm = this.fb.group({
    organization: '',
    application: '',
    role: ''
  });

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
  }

  filter() {
    this.filterForm.get('organization').setValue(this.filterForm.value.organization.trim());
    this.filterForm.get('application').setValue(this.filterForm.value.application.trim());
    this.filterForm.get('role').setValue(this.filterForm.value.role.trim());

    this.filtersChange.emit(this.getFilters());
  }

  resetFilter() {
    this.filtersChange.emit({
      organization: '',
      application: '',
      role: ''
    });
  }

  getFilters() {
    return {
      organization: this.filterForm.value.organization,
      application: this.filterForm.value.application,
      role: this.filterForm.value.role
    };
  }
}
