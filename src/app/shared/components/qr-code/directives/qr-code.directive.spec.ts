import { QrCodeDirective } from './qr-code.directive';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { getElement } from '@tests';

@Component({
  template: ` <div data-qa-id="generator" appQrCode>generator</div> `,
})
class TestComponent {}

describe('QrCodeDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let hostDebug: DebugElement;
  let dialogSpy;
  beforeEach(waitForAsync(() => {
    dialogSpy = jasmine.createSpyObj('MatDialog', [
      'closeAll',
      'open',
      'close',
    ]);
    TestBed.configureTestingModule({
      declarations: [QrCodeDirective, TestComponent],
      providers: [{ provide: MatDialog, useValue: dialogSpy }],
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

  it('should open dialog when clicking on directive', () => {
    fixture.detectChanges();
    const { generator } = selectors(hostDebug);

    generator.click();

    expect(dialogSpy.open).toHaveBeenCalled();
  });
});

const selectors = (hostDebug) => {
  return {
    generator: getElement(hostDebug)('generator')?.nativeElement,
  };
};
