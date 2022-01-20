import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FilterComponent } from './filter.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { dispatchInputEvent, getElement } from '@tests';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;
  let hostDebug: DebugElement;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FilterComponent],
        imports: [ReactiveFormsModule, MatInputModule, NoopAnimationsModule],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should emit event with empty strings when clicking reset button', () => {
    const eventSpy = spyOn(component.filtersChange, 'emit');
    component.isFilterShown = true;
    fixture.detectChanges();

    const filterReset = getElement(hostDebug)('filter-reset');
    filterReset.nativeElement.click();

    expect(eventSpy).toHaveBeenCalledWith({
      organization: '',
      role: '',
      application: '',
    });
  });

  it('should display inputs', () => {
    component.isFilterShown = true;
    component.showOrgFilter = true;
    component.showAppFilter = true;
    component.showRoleFilter = true;
    fixture.detectChanges();

    const orgInput = getElement(hostDebug)('filter-organization');
    const appInput = getElement(hostDebug)('filter-application');
    const roleInput = getElement(hostDebug)('filter-role');

    expect(orgInput).toBeTruthy();
    expect(appInput).toBeTruthy();
    expect(roleInput).toBeTruthy();
  });

  it('should not display inputs', () => {
    component.isFilterShown = true;
    fixture.detectChanges();

    const orgInput = getElement(hostDebug)('filter-organization');
    const appInput = getElement(hostDebug)('filter-application');
    const roleInput = getElement(hostDebug)('filter-role');

    expect(orgInput).toBeNull();
    expect(appInput).toBeNull();
    expect(roleInput).toBeNull();
  });

  it('should emit values after setting organization value', () => {
    const eventSpy = spyOn(component.filtersChange, 'emit');
    component.isFilterShown = true;
    component.showOrgFilter = true;
    fixture.detectChanges();

    const orgInput = getElement(hostDebug)('filter-organization').nativeElement;
    orgInput.value = '123';
    dispatchInputEvent(orgInput);

    expect(eventSpy).toHaveBeenCalledWith({
      organization: '123',
      application: '',
      role: '',
    });
  });

  it('should trim values before emitting', () => {
    const eventSpy = spyOn(component.filtersChange, 'emit');
    component.isFilterShown = true;
    component.showOrgFilter = true;
    fixture.detectChanges();

    const orgInput = getElement(hostDebug)('filter-organization').nativeElement;
    orgInput.value = '123  ';
    dispatchInputEvent(orgInput);

    expect(eventSpy).toHaveBeenCalledWith({
      organization: '123',
      application: '',
      role: '',
    });
  });
});
