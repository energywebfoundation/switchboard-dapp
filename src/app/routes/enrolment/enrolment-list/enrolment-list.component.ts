import { Component, Input } from '@angular/core';
import { ColumnDefinition } from '../../../shared/components/table/generic-table/generic-table.component';
import { EnrolmentClaim } from '../models/enrolment-claim';
import { FilterStatus } from './models/filter-status.enum';
import { CascadingFilterService } from '@modules';

@Component({
  selector: 'app-enrolment-list',
  templateUrl: './enrolment-list.component.html',
  styleUrls: ['./enrolment-list.component.scss'],
  providers: [CascadingFilterService],
})
export class EnrolmentListComponent {
  @Input() enrolmentStatus: FilterStatus;
  @Input() showDID = false;
  @Input() showRevokeFilters = false;
  @Input() columDefinitions: ColumnDefinition[];
  @Input() filterStatuses: FilterStatus[];
  @Input() set list(data: EnrolmentClaim[]) {
    this.cascadingFilterService.setItems(data);
  }

  get filteredList$() {
    return this.cascadingFilterService.getList$();
  }

  constructor(private cascadingFilterService: CascadingFilterService) {}
}
