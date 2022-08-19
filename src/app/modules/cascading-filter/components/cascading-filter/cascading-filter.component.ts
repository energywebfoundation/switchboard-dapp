import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { CascadingFilterService } from '../../services/cascading-filter/cascading-filter.service';
import { debounceTime } from 'rxjs/operators';
import { FilterStatus } from '../../../../routes/enrolment/enrolment-list/models/filter-status.enum';
import { MatSelectChange } from '@angular/material/select/select';

@Component({
  selector: 'app-cascading-filter',
  templateUrl: './cascading-filter.component.html',
  styleUrls: ['./cascading-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CascadingFilterComponent implements OnInit {
  @Input() filterStatuses: FilterStatus[];
  @Input() set status(status: FilterStatus) {
    if (!status) {
      return;
    }
    this.defaultStatus = status;
    this.cascadingFilterService.setStatus(status);
  }
  @Input() showDID = false;
  organizations$ = this.cascadingFilterService.getOrganizations$();
  applications$: Observable<string[]> =
    this.cascadingFilterService.getApplications$();
  roleNames$: Observable<string[]> =
    this.cascadingFilterService.getRoleNames$();
  organization = new FormControl('');
  application = new FormControl('');
  roleName = new FormControl('');
  did: FormControl = new FormControl('');
  defaultStatus: FilterStatus = FilterStatus.All;
  constructor(private cascadingFilterService: CascadingFilterService) {}

  ngOnInit(): void {
    this.organization.valueChanges
      .pipe(debounceTime(300))
      .subscribe((value) => {
        this.cascadingFilterService.setOrganizationFilter(value);
        this.resetControl(this.application);
        this.resetControl(this.roleName);
      });

    this.application.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
      this.cascadingFilterService.setApplicationFilter(value);
      this.resetControl(this.roleName);
    });

    this.roleName.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
      this.cascadingFilterService.setRoleFilter(value);
    });
  }

  statusChange(event: MatSelectChange): void {
    this.cascadingFilterService.setStatus(event.value);
    this.resetControl(this.organization);
    this.resetControl(this.application);
    this.resetControl(this.roleName);
  }

  updateSearchByDidValue(did: string) {
    this.cascadingFilterService.setDID(did);
  }

  private resetControl(control: FormControl): void {
    if (control.value === '') {
      return;
    }
    control.setValue('');
  }
}
