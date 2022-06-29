import { Component, Input } from '@angular/core';
import { ColumnDefinition } from '../../../shared/components/table/generic-table/generic-table.component';
import { EnrolmentClaim } from '../models/enrolment-claim';
import { EnrolmentFilterListService } from './services/enrolment-filter-list.service';
import { FilterStatus } from './models/filter-status.enum';

@Component({
  selector: 'app-enrolment-list',
  templateUrl: './enrolment-list.component.html',
  styleUrls: ['./enrolment-list.component.scss'],
  providers: [EnrolmentFilterListService],
})
export class EnrolmentListComponent {
  @Input() set enrolmentStatus(status: FilterStatus) {
    this.enrolmentFilterListService.setStatus(status);
  }
  @Input() showDID = false;
  @Input() showRevokeFilters = false;
  @Input() columDefinitions: ColumnDefinition[];
  @Input() set list(data: EnrolmentClaim[]) {
    this.enrolmentFilterListService.setList(data);
  }

  get filteredList$() {
    const filteredList = this.enrolmentFilterListService.filteredList$;
    return filteredList;
  }

  constructor(private enrolmentFilterListService: EnrolmentFilterListService) {}
}
