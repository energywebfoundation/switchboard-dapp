import { Injectable } from '@angular/core';
import { IamService } from '../iam.service';
import { AssetHistoryEventType, ClaimEventType } from 'iam-client-lib';
import { SwitchboardToastrService } from '../switchboard-toastr.service';
import { NotificationService } from '../notification.service';
import { MessagingFacadeService } from './messaging-facade.service';

@Injectable({
  providedIn: 'root',
})
export class MessageSubscriptionService {
  constructor(
    private iamService: IamService,
    private messagingService: MessagingFacadeService,
    private toastr: SwitchboardToastrService,
    private notifService: NotificationService
  ) {}

  async init() {
    await this.messagingService.subscribeTo({
      messageHandler: this._handleMessage.bind(this),
    });
  }

  private _handleMessage(message: any) {
    if (message.type) {
      this._handleAssetEvents(message.type);
      this._handleClaimEvents(message.type);
    }
  }

  private _handleAssetEvents(type: string) {
    switch (type) {
      case AssetHistoryEventType.ASSET_OFFERED:
        this.toastr.info('An asset is offered to you.', 'Asset Offered');
        this.notifService.increaseAssetsOfferedToMeCount();
        break;
      case AssetHistoryEventType.ASSET_TRANSFERRED:
        this.toastr.success(
          'Your asset is successfully tranferred to a new owner.',
          'Asset Transferred'
        );
        break;
      case AssetHistoryEventType.ASSET_OFFER_CANCELED:
        this.toastr.warning(
          'An asset offered to you is cancelled by the owner.',
          'Asset Offer Cancelled'
        );
        this.notifService.decreaseAssetsOfferedToMeCount();
        break;
      case AssetHistoryEventType.ASSET_OFFER_REJECTED:
        this.toastr.warning(
          'An asset you offered is rejected.',
          'Asset Offer Rejected'
        );
        break;
    }
  }

  private _handleClaimEvents(type: string) {
    switch (type) {
      case ClaimEventType.REQUEST_CREDENTIALS:
        this.notifService.increasePendingApprovalCount();
        this.toastr.info(
          'A new enrolment request is waiting for your approval.',
          'New Enrolment Request'
        );
        break;
      case ClaimEventType.ISSUE_CREDENTIAL:
        this.notifService.increasePendingDidDocSyncCount();
        this.toastr.info(
          'Your enrolment request is approved. ' +
            'Please sync your approved claims in your DID Document.',
          'Enrolment Approved'
        );
        break;
      case ClaimEventType.REJECT_CREDENTIAL:
        this.toastr.warning(
          'Your enrolment request is rejected.',
          'New Enrolment Request'
        );
        break;
    }
  }
}
