import { QrCodeScannerDirective } from './qr-code-scanner.directive';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { dialogSpy, getElement } from '@tests';
import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

@Component({
  template: `
    <div data-qa-id="scanner" appQrCodeScanner (scannedValue)="scanned = true">scanner</div>
  `
})
class TestComponent {
  scanned = false;
}

describe('QrCodeScannerDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let hostDebug: DebugElement;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [QrCodeScannerDirective, TestComponent],
      providers: [{provide: MatDialog, useValue: dialogSpy}],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
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
    dialogSpy.open.and.returnValue({afterClosed: () => of({value: 'did'})});
    getElement(hostDebug)('scanner').nativeElement.click();

    expect(component.scanned).toBeTrue();
  });
});
