import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ScanType } from '../../../../shared/components/qr-code-scanner/models/scan-type.enum';
import { QrCodeData } from '../../../../shared/components/qr-code-scanner/models/qr-code-data.interface';
import { userLocalStorage } from '../../../../shared/utils/local-storage-wrapper';

@Component({
  selector: 'app-user-did',
  templateUrl: './user-did.component.html',
  styleUrls: ['./user-did.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDidComponent {
  @Input() did: string;

  get header(): string {
    return 'User Data QR Code';
  }
  get qrCodeData(): QrCodeData {
    return {
      type: ScanType.User,
      data: {
        did: this.did,
        label: userLocalStorage.parsed?.name,
      },
    };
  }
}
