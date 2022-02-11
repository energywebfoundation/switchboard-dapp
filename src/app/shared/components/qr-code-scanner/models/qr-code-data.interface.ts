import { ScanType } from './scan-type.enum';

export interface QrCodeData {
  type: ScanType;
  data: {
    did: string;
    label?: string;
  };
}
