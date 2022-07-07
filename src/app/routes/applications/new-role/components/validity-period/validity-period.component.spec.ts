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
  beforeEach(
    waitForAsync(() => {
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
    })
  );

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
    component.validityPeriod = 135;
    fixture.detectChanges();

    const { periodInput } = getSelectors(hostDebug);

    expect(periodInput.value).toEqual('135');
  });

  it('should emit value from the input', () => {
    component.validityPeriod = undefined;
    fixture.detectChanges();

    const { periodInput, periodNext } = getSelectors(hostDebug);

    periodInput.value = 100;
    dispatchInputEvent(periodInput);
    fixture.detectChanges();

    periodNext.click();
    fixture.detectChanges();

    expect(nextSpy).toHaveBeenCalledWith(100);
  });
});

const getSelectors = (hostDebug) => ({
  periodInput: getElement(hostDebug)('period')?.nativeElement,
  periodNext: getElement(hostDebug)('period-next')?.nativeElement,
});
