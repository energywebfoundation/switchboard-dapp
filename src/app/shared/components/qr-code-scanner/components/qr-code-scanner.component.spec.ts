import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QrCodeScannerComponent } from './qr-code-scanner.component';
import { MatDialogRef } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ScanType } from '../models/scan-type.enum';

describe('QrCodeScannerComponent', () => {
  let component: QrCodeScannerComponent;
  let fixture: ComponentFixture<QrCodeScannerComponent>;
  let dialogSpy;
  beforeEach(waitForAsync(() => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['close']);
    TestBed.configureTestingModule({
      declarations: [QrCodeScannerComponent],
      providers: [{ provide: MatDialogRef, useValue: dialogSpy }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    spyOn(console, 'error');
    fixture = TestBed.createComponent(QrCodeScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog with proper object', () => {
    const object = { did: '123', type: ScanType.Asset };
    component.scanned({ text: JSON.stringify(object) });

    expect(dialogSpy.close).toHaveBeenCalledWith(object);
  });

  it('should print error in console', () => {
    component.scanned({ text: '{a: a}' });
    expect(console.error).toHaveBeenCalled();
  });

  it('should not call dialog close', () => {
    component.scanned(undefined);
    expect(dialogSpy.close).not.toHaveBeenCalled();
  });
});
