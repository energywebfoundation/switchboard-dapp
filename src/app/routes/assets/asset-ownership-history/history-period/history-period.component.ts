import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AssetHistory } from 'iam-client-lib';

export interface Period extends AssetHistory {
  type: string;
}

const ASSET_TRANSFERRED = 'ASSET_TRANSFERRED';

@Component({
  selector: 'app-history-period',
  templateUrl: './history-period.component.html',
  styleUrls: ['./history-period.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryPeriodComponent {
  @Input() period: Period;

  getTopPart() {
    if (!this.period) {
      return;
    }
    if (this.period.type === ASSET_TRANSFERRED) {
      return {
        header: 'Offered from',
        element: this.period.relatedTo
      };
    }
    return {
      header: 'Owner',
      element: this.period.emittedBy
    };
  }

  getBottomPart() {
    if (!this.period) {
      return;
    }
    if (this.period.type === ASSET_TRANSFERRED) {
      return {
        header: 'Owner',
        element: this.period.emittedBy
      };
    }
    return {
      header: 'Offered to',
      element: this.period.relatedTo
    };
  }
}
