import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';

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

  @Input() showOrgFilter = false;
  @Input() showAppFilter = false;
  @Input() showRoleFilter = false;
  @Output() filtered = new EventEmitter<FilteredData>();
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
    this.filtered.emit();
  }

  resetFilter() {

  }
}
