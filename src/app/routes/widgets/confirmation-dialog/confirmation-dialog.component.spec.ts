import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  ConfirmationDialogComponent,
  ConfirmationDialogData,
} from './confirmation-dialog.component';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { dialogSpy, getElement } from '@tests';

class ConfirmDialogDataMock {
  setData(value: ConfirmationDialogData) {
    Object.assign(this, value);
  }
}

describe('ConfirmationDialogComponent', () => {
  let component: ConfirmationDialogComponent;
  let fixture: ComponentFixture<ConfirmationDialogComponent>;
  let mockDialogData: ConfirmDialogDataMock;
  let hostDebug: DebugElement;
  beforeEach(() => {
    mockDialogData = new ConfirmDialogDataMock();
    TestBed.configureTestingModule({
      declarations: [ConfirmationDialogComponent],
      imports: [MatButtonModule, MatIconTestingModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: MatDialogRef, useValue: dialogSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should not display icon', () => {
    fixture.detectChanges();
    const { icon } = getSelectors(hostDebug);

    expect(icon).toBeUndefined();
  });

  it('should display icon', () => {
    mockDialogData.setData({ svgIcon: 'svg-icon' });
    fixture.detectChanges();
    const { icon } = getSelectors(hostDebug);
    expect(component.svgIcon).toEqual('svg-icon');

    expect(icon).toBeTruthy();
  });

  it('should display default text for header when it is not specified', () => {
    fixture.detectChanges();
    const { header } = getSelectors(hostDebug);

    expect(header.innerText).toContain('Confirm');
  });

  it('should display text from data', () => {
    mockDialogData.setData({ header: 'header text' });
    fixture.detectChanges();
    const { header } = getSelectors(hostDebug);

    expect(header.innerText).toContain('header text');
  });

  it('should display discard buttons', () => {
    mockDialogData.setData({ isDiscardButton: true });
    fixture.detectChanges();
    const { continueBtn, discardBtn } = getSelectors(hostDebug);

    expect(continueBtn).toBeTruthy();
    expect(discardBtn).toBeTruthy();
  });

  it('should display proceed buttons', () => {
    mockDialogData.setData({ isProceedButton: true });
    fixture.detectChanges();
    const { proceedBtn, cancelBtn } = getSelectors(hostDebug);

    expect(proceedBtn).toBeTruthy();
    expect(cancelBtn).toBeTruthy();
  });

  it('should check if calling cancel will propagate value', () => {
    component.close(true);
    expect(dialogSpy.close).toHaveBeenCalledWith(true);
  });
});
const getSelectors = (hostDebug) => {
  return {
    icon: getElement(hostDebug)('icon')?.nativeElement,
    header: getElement(hostDebug)('header')?.nativeElement,
    message: getElement(hostDebug)('message')?.nativeElement,
    cancelBtn: getElement(hostDebug)('cancel')?.nativeElement,
    confirmBtn: getElement(hostDebug)('confirm')?.nativeElement,
    continueBtn: getElement(hostDebug)('continue')?.nativeElement,
    discardBtn: getElement(hostDebug)('discard')?.nativeElement,
    proceedBtn: getElement(hostDebug)('proceed')?.nativeElement,
  };
};
