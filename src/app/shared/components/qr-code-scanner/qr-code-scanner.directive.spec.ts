import { QrCodeScannerDirective } from './qr-code-scanner.directive';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { dialogSpy } from '@tests';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  template: `
    <div appQrCodeScanner>scanner</div>
  `
})
class TestComponent {
}

describe('QrCodeScannerDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
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
    fixture.detectChanges();
  });

  it('should create component with directive', () => {
    expect(component).toBeTruthy();
  });


});
