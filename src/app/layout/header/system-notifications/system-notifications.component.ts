import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-system-notifications',
  templateUrl: './system-notifications.component.html',
  styleUrls: ['./system-notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SystemNotificationsComponent {
  @Input() assetsOfferedToMeCount: number;
  @Input() pendingAssetSyncCount: number;
  @Input() pendingApprovalCount: number;

  get totalCount() {
    return (
      this.assetsOfferedToMeCount +
      this.pendingApprovalCount +
      this.pendingAssetSyncCount
    );
  }
}
