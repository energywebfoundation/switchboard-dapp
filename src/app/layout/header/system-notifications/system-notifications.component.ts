import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'app-system-notifications',
  templateUrl: './system-notifications.component.html',
  styleUrls: ['./system-notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SystemNotificationsComponent implements OnInit {
  @Input() isLoadingNotif: boolean;
  @Input() totalCount: number;
  @Input() assetsOfferedToMeCount: number;
  @Input() pendingAssetSyncCount: number;
  @Input() pendingApprovalCount: number;
  constructor() {}

  ngOnInit(): void {}

  hideBadges() {
    return this.totalCount === 0;
  }
}
