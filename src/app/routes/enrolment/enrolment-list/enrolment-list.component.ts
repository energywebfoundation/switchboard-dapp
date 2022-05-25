import { Component, Input } from '@angular/core';
import { FilterStatus } from './enrolment-list-filter/enrolment-list-filter.component';
import { ColumnDefinition } from '../../../shared/components/table/generic-table/generic-table.component';
import { EnrolmentClaim } from '../models/enrolment-claim.interface';
import { EnrolmentFilterListService } from './services/enrolment-filter-list.service';

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
  @Input() showDID: boolean = false;
  @Input() columDefinitions: ColumnDefinition[];
  @Input() set list(data: EnrolmentClaim[]) {
    this.enrolmentFilterListService.setList(data);
  }

  get filteredList$() {
    return this.enrolmentFilterListService.filteredList$;
  }

  constructor(private enrolmentFilterListService: EnrolmentFilterListService) {}
}
