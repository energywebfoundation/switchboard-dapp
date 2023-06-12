import { TestBed } from '@angular/core/testing';

import { QrCodeService } from './qr-code.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

describe('QrCodeService', () => {
  let service: QrCodeService;
  let dialogSpy;
  beforeEach(() => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    TestBed.configureTestingModule({
      providers: [{ provide: MatDialog, useValue: dialogSpy }],
    });
    service = TestBed.inject(QrCodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open dialog', () => {
    service.open(null);

    expect(dialogSpy.open).toHaveBeenCalled();
  });
});
