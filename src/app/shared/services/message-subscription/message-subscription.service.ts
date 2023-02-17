import { Injectable, OnDestroy } from '@angular/core';
import { IamService } from '../iam.service';
import { AssetHistoryEventType, ClaimEventType } from 'iam-client-lib';
import { SwitchboardToastrService } from '../switchboard-toastr.service';
import { NotificationService } from '../notification.service';
import { EnrolmentsFacadeService } from '@state';

@Injectable({
  providedIn: 'root',
})
export class MessageSubscriptionService implements OnDestroy {
  private subscriptionId: number;
  constructor(
    private iamService: IamService,
    private toastr: SwitchboardToastrService,
    private notifService: NotificationService,
    private enrolmentsFacade: EnrolmentsFacadeService
  ) {}

  ngOnDestroy() {
    this.iamService.messagingService.unsubscribeFrom(this.subscriptionId);
  }

  async init() {
    this.subscriptionId = await this.iamService.messagingService.subscribeTo({
      messageHandler: this.handleMessage.bind(this),
    });
  }

  private handleMessage(message: {
    type: ClaimEventType & AssetHistoryEventType;
    claimId: string;
  }) {
    if (message.type) {
      this.handleAssetEvents(message.type);
      this.handleClaimEvents(message.type, message.claimId);
    }
  }

  private handleAssetEvents(type: AssetHistoryEventType) {
    switch (type) {
      case AssetHistoryEventType.ASSET_OFFERED:
        this.toastr.info('An asset is offered to you.', 'Asset Offered');
        this.notifService.increaseAssetsOfferedToMeCount();
        break;
      case AssetHistoryEventType.ASSET_TRANSFERRED:
        this.toastr.success(
          'Your asset is successfully transferred to a new owner.',
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

  private handleClaimEvents(type: ClaimEventType, claimId: string) {
    switch (type) {
      case ClaimEventType.REQUEST_CREDENTIALS:
        this.updateEnrolmentLists(claimId);
        this.toastr.info(
          'A new enrolment request is waiting for your approval.',
          'New Enrolment Request'
        );
        break;
      case ClaimEventType.ISSUE_CREDENTIAL:
        this.updateEnrolmentLists(claimId);
        this.toastr.info(
          'Your enrolment request is approved. ' +
            'Please sync your approved claims in your DID Document.',
          'Enrolment Approved'
        );
        break;
      case ClaimEventType.REJECT_CREDENTIAL:
        this.updateEnrolmentLists(claimId);
        this.toastr.warning(
          'Your enrolment request is rejected.',
          'New Enrolment Request'
        );
        break;
    }
  }

  /**
   * Update enrolment lists in the store. User might enrol for a role, that is an issuer.
   * The safest is to update both lists.
   * @param claimId
   * @private
   */
  private updateEnrolmentLists(claimId: string) {
    this.enrolmentsFacade.update(claimId);
  }
}
