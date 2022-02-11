import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { DidBookRecord } from '../models/did-book-record';
import { QrCodeData } from '../../../../shared/components/qr-code-scanner/models/qr-code-data.interface';
import { ScanType } from '../../../../shared/components/qr-code-scanner/models/scan-type.enum';

@Component({
  selector: 'app-did-book-list',
  templateUrl: './did-book-list.component.html',
  styleUrls: ['./did-book-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DidBookListComponent {
  @Input() set list(value: DidBookRecord[]) {
    if (!value) {
      return;
    }

    this.data = value;
  }

  get list() {
    return this.data;
  }

  @Output() delete = new EventEmitter<string>();

  displayedColumns = ['label', 'did', 'actions'];
  private data: DidBookRecord[] = [];

  remove(id: string) {
    this.delete.emit(id);
  }

  qrCodeData(element: DidBookRecord): QrCodeData {
    return {
      type: ScanType.User,
      data: {
        did: element.did,
        label: element.label,
      },
    };
  }
}
