import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { EnrolmentClaim } from '../models/enrolment-claim';
import { IamService } from '../../../shared/services/iam.service';
import { isAsset } from 'src/app/state/enrolments/utils/remove-assets-from-list/remove-assets-from-list';
import {
  ColumnDefinition,
  ColumnType,
} from '../../../shared/components/table/generic-table/generic-table.component';
import { EnrolmentListType } from '../enrolment-list/models/enrolment-list-type.enum';
import { RegistrationTypes } from 'iam-client-lib';
import { RevokeService } from '../services/revoke/revoke.service';

@Component({
  selector: 'app-revoke-enrolment-list',
  templateUrl: './revoke-enrolment-list.component.html',
  styleUrls: ['./revoke-enrolment-list.component.scss'],
})
export class MyRevokablesListComponent implements OnInit, OnDestroy {
  @ViewChild('actions') actions;
  @ViewChild('status') status;
  @ViewChild('revoke') revoke;
  @Input() list: EnrolmentClaim[];
  @Input() columnDefinitions: ColumnDefinition[];
  @ViewChild(MatSort) sort: MatSort;
  @Output() refreshList = new EventEmitter<void>();
  @Output() revoked = new EventEmitter();
  columns: ColumnDefinition[];
  private _iamSubscriptionId: number;
  enrolmentType = EnrolmentListType.REVOKER;

  constructor(
    private iamService: IamService,
    private revokeService: RevokeService
  ) {}

  isAsset(element) {
    isAsset(element);
  }

  async ngOnInit() {
    this._iamSubscriptionId =
      await this.iamService.messagingService.subscribeTo({
        messageHandler: this._handleMessage.bind(this),
      });

    this.defineColumns();
  }

  async ngOnDestroy(): Promise<void> {
    // Unsubscribe from IAM Events
    await this.iamService.messagingService.unsubscribeFrom(
      this._iamSubscriptionId
    );
  }

  async revokeOffChainClaim(element: EnrolmentClaim) {
    console.log('revoking off chain', element);
  }

  revokeOnChainClaim(element: EnrolmentClaim) {
    this.revokeService.revokeOnChain(element).subscribe(() => {
      this.refreshList.emit();
    });
  }

  async isSyncedOnChain(element: EnrolmentClaim) {
    return element?.registrationTypes?.includes(RegistrationTypes.OnChain);
  }

  isPendingSync(element: EnrolmentClaim) {
    return !element?.isSynced;
  }

  updateList(): void {
    this.refreshList.emit();
  }

  private async _handleMessage(message) {
    if (message.issuedToken || message.isRejected) {
      this.updateList();
    }
  }

  private defineColumns() {
    this.columns = [
      { type: ColumnType.Date, field: 'requestDate', header: 'Request Date' },
      { type: ColumnType.String, field: 'roleName', header: 'Claim Name' },
      {
        type: ColumnType.String,
        field: 'namespace',
        header: 'Parent Namespace',
      },
      {
        type: ColumnType.DID,
        field: 'requester',
        header: 'Requestor DID',
      },
      {
        type: ColumnType.Custom,
        field: 'revoke',
        header: 'Revoke',
        customElement: this.revoke,
      },
    ];
  }
}
