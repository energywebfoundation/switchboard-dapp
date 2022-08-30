import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ValidityPeriodComponent } from './validity-period.component';
import { TimeDurationPipe } from '../../../../../shared/pipes/time-duration/time-duration.pipe';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { dispatchInputEvent, getElement } from '@tests';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

describe('ValidityPeriodComponent', () => {
  let component: ValidityPeriodComponent;
  let fixture: ComponentFixture<ValidityPeriodComponent>;
  let hostDebug: DebugElement;
  let nextSpy;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        MatIconTestingModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatInputModule,
        NoopAnimationsModule,
      ],
      declarations: [ValidityPeriodComponent, TimeDurationPipe],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidityPeriodComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
    nextSpy = spyOn(component.next, 'emit');
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should update input with provided value', () => {
    component.validityPeriod = 120015;
    fixture.detectChanges();

    const { yearsInput, daysInput, hoursInput, minutesInput, secondsInput } =
      getSelectors(hostDebug);

    expect(+yearsInput.value).toEqual(0);
    expect(+daysInput.value).toEqual(0);
    expect(+hoursInput.value).toEqual(0);
    expect(+minutesInput.value).toEqual(2);
    expect(+secondsInput.value).toEqual(15);
  });

  it('should emit value from the inputs', () => {
    component.validityPeriod = undefined;
    fixture.detectChanges();

    const { minutesInput, secondsInput, periodNext } = getSelectors(hostDebug);

    secondsInput.value = 40;
    dispatchInputEvent(secondsInput);
    fixture.detectChanges();

    minutesInput.value = 1;
    dispatchInputEvent(minutesInput);
    fixture.detectChanges();

    periodNext.click();
    fixture.detectChanges();

    expect(nextSpy).toHaveBeenCalledWith(60040);
  });

  it('should return 10 minutes when passing object contains only minutes', () => {
    fixture.detectChanges();

    const { minutesInput, periodNext } = getSelectors(hostDebug);

    minutesInput.value = 10;
    dispatchInputEvent(minutesInput);
    fixture.detectChanges();

    periodNext.click();
    fixture.detectChanges();

    expect(nextSpy).toHaveBeenCalledWith(600000);
  });

  it('should update inputs while containing only minutes', () => {
    component.validityPeriod = 600000;
    fixture.detectChanges();

    const { yearsInput, daysInput, hoursInput, minutesInput, secondsInput } =
      getSelectors(hostDebug);

    expect(+yearsInput.value).toEqual(0);
    expect(+daysInput.value).toEqual(0);
    expect(+hoursInput.value).toEqual(0);
    expect(+minutesInput.value).toEqual(10);
    expect(+secondsInput.value).toEqual(0);
  });

  it('should emit value from one input', () => {
    component.validityPeriod = undefined;
    fixture.detectChanges();

    const { yearsInput, periodNext } = getSelectors(hostDebug);

    yearsInput.value = '1';
    dispatchInputEvent(yearsInput);
    fixture.detectChanges();

    periodNext.click();
    fixture.detectChanges();

    expect(nextSpy).toHaveBeenCalledWith(60 * 60 * 24 * 365 * 1000);
  });
});

const getSelectors = (hostDebug) => ({
  yearsInput: getElement(hostDebug)('years')?.nativeElement,
  daysInput: getElement(hostDebug)('days')?.nativeElement,
  hoursInput: getElement(hostDebug)('hours')?.nativeElement,
  minutesInput: getElement(hostDebug)('minutes')?.nativeElement,
  secondsInput: getElement(hostDebug)('seconds')?.nativeElement,
  periodNext: getElement(hostDebug)('period-next')?.nativeElement,
});
