import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExpirationDateComponent } from './expiration-date.component';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { dispatchInputEvent, getElement } from '@tests';

describe('ExpirationDateComponent', () => {
  let component: ExpirationDateComponent;
  let fixture: ComponentFixture<ExpirationDateComponent>;
  let hostDebug: DebugElement;
  let baseTime: Date;
  let timezoneSeconds: number;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ExpirationDateComponent],
        imports: [
          ReactiveFormsModule,
          MatInputModule,
          MatIconTestingModule,
          MatButtonModule,
          NoopAnimationsModule,
          MatDatepickerModule,
          MatNativeDateModule,
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpirationDateComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
    spyOn(component.add, 'emit');
    jasmine.clock().install();
    baseTime = new Date(2000, 0, 1, 1, 0, 0);
    timezoneSeconds = baseTime.getTimezoneOffset() * 60;
    jasmine.clock().mockDate(baseTime);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should set expiration date and reset it', () => {
    component.defaultValidityPeriod = 60 * 60 * 24 * 2;
    fixture.detectChanges();

    const { expirationDateInput, resetDate } = getSelectors(hostDebug);
    expirationDateInput.value = '1/2/2000';
    dispatchInputEvent(expirationDateInput);
    fixture.detectChanges();

    expect(component.add.emit).toHaveBeenCalledWith(
      60 * 60 * 24 + timezoneSeconds
    );

    resetDate.click();
    fixture.detectChanges();
    const expirationDate = new Date(
      baseTime.getTime() + component.defaultValidityPeriod * 1000
    );
    expect(
      new Date(expirationDateInput.value).getTime() - timezoneSeconds * 1000
    ).toEqual(expirationDate.getTime());
    expect(component.add.emit).toHaveBeenCalledWith(
      component.defaultValidityPeriod
    );
  });

  it('should check if remove button sets expiration time as undefined', () => {
    component.defaultValidityPeriod = 100;
    fixture.detectChanges();

    const { removeButton } = getSelectors(hostDebug);
    removeButton.click();
    fixture.detectChanges();

    expect(component.add.emit).toHaveBeenCalledWith(undefined);
  });

  it('should set default time in input from current time', () => {
    component.defaultValidityPeriod = 60 * 60 * 24;
    fixture.detectChanges();

    const { expirationDateInput } = getSelectors(hostDebug);

    expect(new Date(expirationDateInput.value)).toEqual(new Date(2000, 0, 2));
  });

  it('test logic', () => {
    const getHoursShift = () => {
      const now = new Date(Date.now());
      console.log('now.getUTCSeconds() ', now.getUTCSeconds());
      console.log('now.getUTCHours() ', now.getUTCHours());
      console.log('now.getTimezoneOffset() ', now.getTimezoneOffset());
      return (
        now.getUTCSeconds() +
        now.getUTCMinutes() * 60 +
        now.getUTCHours() * 60 * 60 -
        now.getTimezoneOffset() * 60
      );
    };
    console.log(Date.now() / 1000);
    console.log(new Date('1/2/2000').getTime() / 1000);
    console.log(946767600 - 946681211);
    console.log(getHoursShift());
  });
});
const getSelectors = (hostDebug) => ({
  removeButton: getElement(hostDebug)('remove-expiration-date')?.nativeElement,
  addButton: getElement(hostDebug)('add-expiration-date')?.nativeElement,
  expirationDateInput: getElement(hostDebug)('expiration-date-input')
    ?.nativeElement,
  resetDate: getElement(hostDebug)('reset-date')?.nativeElement,
});
