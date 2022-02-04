import { Component, Input } from '@angular/core';
import { RolePreconditionType } from '../models/role-precondition-type.enum';
import { PreconditionCheck } from '../utils/precondition-check';

@Component({
  selector: 'app-role-precondition-list',
  templateUrl: './role-precondition-list.component.html',
  styleUrls: ['./role-precondition-list.component.scss'],
})
export class RolePreconditionListComponent {
  @Input() preconditionList: PreconditionCheck;

  isApproved(status: RolePreconditionType): boolean {
    return status === RolePreconditionType.APPROVED;
  }

  isPending(status: RolePreconditionType): boolean {
    return status === RolePreconditionType.PENDING;
  }
}
