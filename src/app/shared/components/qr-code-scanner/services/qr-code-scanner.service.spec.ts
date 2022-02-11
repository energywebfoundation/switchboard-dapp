import { TestBed } from '@angular/core/testing';

import { QrCodeScannerService } from './qr-code-scanner.service';
import { DidBookService } from '../../../../modules/did-book/services/did-book.service';
import { SwitchboardToastrService } from '../../../services/switchboard-toastr.service';
import { MatDialog } from '@angular/material/dialog';
import { ScanType } from '../models/scan-type.enum';

describe('QrCodeScannerService', () => {
  let service: QrCodeScannerService;
  let didBookServiceSpy;
  let toastrSpy;
  let dialogSpy;
  beforeEach(() => {
    didBookServiceSpy = jasmine.createSpyObj(DidBookService, ['exist']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['info']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    TestBed.configureTestingModule({
      providers: [
        { provide: DidBookService, useValue: didBookServiceSpy },
        { provide: SwitchboardToastrService, useValue: toastrSpy },
        { provide: MatDialog, useValue: dialogSpy },
      ],
    });
    service = TestBed.inject(QrCodeScannerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call toastr information when did already exsit in contact book', () => {
    didBookServiceSpy.exist.and.returnValue(true);
    service.dataFactory({ type: ScanType.User, data: { did: '123' } });

    expect(toastrSpy.info).toHaveBeenCalled();
  });

  it('should open did contact book component when did do not exist on the list', () => {
    didBookServiceSpy.exist.and.returnValue(false);
    service.dataFactory({ type: ScanType.User, data: { did: '123' } });

    expect(dialogSpy.open).toHaveBeenCalled();
  });

  it('should display error when scanning not supported type', () => {
    spyOn(console, 'error');

    service.dataFactory({ type: 'random Type' as any, data: { did: '123' } });

    expect(console.error).toHaveBeenCalled();
  });
});
