import { QrCodeScannerDirective } from './qr-code-scanner.directive';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { QrCodeScannerComponent } from './qr-code-scanner.component';
import { MatDialogRef } from '@angular/material/dialog';
import { dialogSpy } from '@tests';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('QrCodeScannerDirective', () => {
  let component: QrCodeScannerComponent;
  let fixture: ComponentFixture<QrCodeScannerComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [QrCodeScannerDirective],
      providers: [{provide: MatDialogRef, useValue: dialogSpy}],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrCodeScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
