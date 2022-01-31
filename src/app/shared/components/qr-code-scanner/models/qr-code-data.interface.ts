import { ScanType } from './scan-type.enum';

export interface QrCodeData {
  type: ScanType;
  did: string;
  additionalData?: { label?: string };
}
