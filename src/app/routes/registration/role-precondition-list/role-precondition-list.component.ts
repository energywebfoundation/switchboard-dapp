import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { RolePreconditionType } from '../models/role-precondition-type.enum';
import { PreconditionCheck } from '../utils/precondition-check';
import { PublishRoleService } from '../../../shared/services/publish-role/publish-role.service';
import { truthy } from '@operators';

@Component({
  selector: 'app-role-precondition-list',
  templateUrl: './role-precondition-list.component.html',
  styleUrls: ['./role-precondition-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolePreconditionListComponent implements OnInit {
  @Input() preconditionList: PreconditionCheck[];
  @Input() userRoles: { claimType: string; issuedToken?: string }[] = [];

  list: (PreconditionCheck & { claimType: string; issuedToken?: string })[] =
    [];

  constructor(
    private publishRoleService: PublishRoleService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.createPreconditionList();
  }

  isApproved(status: RolePreconditionType): boolean {
    return status === RolePreconditionType.APPROVED;
  }

  isPending(status: RolePreconditionType): boolean {
    return status === RolePreconditionType.PENDING;
  }

  publishToDIDDoc(item): void {
    this.publishRoleService
      .addToDidDoc(item)
      .pipe(truthy())
      .subscribe(() => {
        this.updateStatus(item);
        this.cdRef.detectChanges();
      });
  }

  private createPreconditionList(): void {
    if (this.preconditionList) {
      this.list = this.preconditionList.map((precondition) => ({
        ...precondition,
        ...this.userRoles.find(
          (role) => role.claimType === precondition.conditionNamespace
        ),
      }));
    }
  }

  private updateStatus(item) {
    this.list = this.list.map((listItem) => {
      return {
        ...listItem,
        status:
          item.conditionNamespace === listItem.conditionNamespace
            ? RolePreconditionType.SYNCED
            : item.status,
      };
    });
  }
}
