import { QrCodeScannerDirective } from './qr-code-scanner.directive';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { dialogSpy, getElement } from '@tests';
import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { ScanType } from '../models/scan-type.enum';
import { QrCodeScannerService } from '../services/qr-code-scanner.service';

@Component({
  template: `
    <div
      data-qa-id="scanner"
      appQrCodeScanner
      [detect]="shouldDetect"
      (scannedValue)="scanned = true">
      scanner
    </div>
  `,
})
class TestComponent {
  shouldDetect = false;
  scanned = false;
}

describe('QrCodeScannerDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let hostDebug: DebugElement;
  let qrCodeScannerServiceSpy;
  beforeEach(waitForAsync(() => {
    qrCodeScannerServiceSpy = jasmine.createSpyObj(QrCodeScannerService, [
      'dataFactory',
    ]);
    TestBed.configureTestingModule({
      declarations: [QrCodeScannerDirective, TestComponent],
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        { provide: QrCodeScannerService, useValue: qrCodeScannerServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create component with directive', () => {
    expect(component).toBeTruthy();
  });

  it('should check if emits value', () => {
    dialogSpy.open.and.returnValue({
      afterClosed: () => of({ type: ScanType.Asset, data: { did: 'did' } }),
    });
    getElement(hostDebug)('scanner').nativeElement.click();

    expect(component.scanned).toBeTrue();
  });

  it('should not emits value when closing with null', () => {
    dialogSpy.open.and.returnValue({ afterClosed: () => of(null) });
    getElement(hostDebug)('scanner').nativeElement.click();

    expect(component.scanned).toBeFalse();
  });

  it('should not emits value when closing with empty object', () => {
    dialogSpy.open.and.returnValue({ afterClosed: () => of({}) });
    getElement(hostDebug)('scanner').nativeElement.click();

    expect(component.scanned).toBeFalse();
  });

  it('should not emit value when detecting what to do with object', () => {
    dialogSpy.open.and.returnValue({
      afterClosed: () => of({ did: 'did', type: ScanType.Asset }),
    });
    component.shouldDetect = true;
    fixture.detectChanges();
    getElement(hostDebug)('scanner').nativeElement.click();
    expect(component.scanned).toBeFalse();
  });
});
