import {
  ComponentFixture,
  discardPeriodicTasks,
  fakeAsync,
  flush,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';

import { CascadingFilterComponent } from './cascading-filter.component';
import { CascadingFilterService } from '../../services/cascading-filter/cascading-filter.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { dispatchInputEvent, getElement } from '@tests';
import { of } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CascadingFilterComponent', () => {
  let component: CascadingFilterComponent;
  let fixture: ComponentFixture<CascadingFilterComponent>;
  let cascadingFilterServiceSpy;
  beforeEach(waitForAsync(() => {
    cascadingFilterServiceSpy = jasmine.createSpyObj('CascadingFilterService', [
      'setOrganizationFilter',
      'setApplicationFilter',
      'setRoleFilter',
      'getOrganizations$',
      'getApplications$',
      'getRoleNames$',
    ]);

    TestBed.configureTestingModule({
      declarations: [CascadingFilterComponent],
      imports: [
        MatInputModule,
        ReactiveFormsModule,
        MatIconTestingModule,
        MatButtonModule,
        MatAutocompleteModule,
        NoopAnimationsModule,
      ],
      providers: [
        {
          provide: CascadingFilterService,
          useValue: cascadingFilterServiceSpy,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CascadingFilterComponent);
    component = fixture.componentInstance;
    cascadingFilterServiceSpy.getOrganizations$.and.returnValue(of([]));
    cascadingFilterServiceSpy.getApplications$.and.returnValue(of([]));
    cascadingFilterServiceSpy.getRoleNames$.and.returnValue(of([]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update orgFilter', fakeAsync(() => {
    const { orgFilter } = getSelectors(fixture.debugElement);

    orgFilter.value = 'org';
    dispatchInputEvent(orgFilter);
    fixture.detectChanges();

    tick(300);

    expect(
      cascadingFilterServiceSpy.setOrganizationFilter
    ).toHaveBeenCalledWith('org');
    flush();
  }));

  it('should update appFilter', fakeAsync(() => {
    const { appFilter } = getSelectors(fixture.debugElement);

    appFilter.value = 'app';
    dispatchInputEvent(appFilter);
    fixture.detectChanges();

    tick(300);

    expect(cascadingFilterServiceSpy.setApplicationFilter).toHaveBeenCalledWith(
      'app'
    );
    flush();
  }));

  it('should update roleNameFilter', fakeAsync(() => {
    const { roleNameFilter } = getSelectors(fixture.debugElement);

    roleNameFilter.value = 'rolename';
    dispatchInputEvent(roleNameFilter);
    fixture.detectChanges();

    tick(300);

    expect(cascadingFilterServiceSpy.setRoleFilter).toHaveBeenCalledWith(
      'rolename'
    );
    flush();
  }));

  it('should reset roleName and application filters when setting orgFilter', fakeAsync(() => {
    const { appFilter, orgFilter, roleNameFilter } = getSelectors(
      fixture.debugElement
    );
    appFilter.value = 'app';
    dispatchInputEvent(appFilter);

    fixture.detectChanges();
    tick(300);
    flush();

    roleNameFilter.value = 'role';
    dispatchInputEvent(roleNameFilter);
    fixture.detectChanges();
    tick(300);

    expect(roleNameFilter.value).toEqual('role');
    expect(appFilter.value).toEqual('app');

    orgFilter.value = 'org';
    dispatchInputEvent(orgFilter);

    fixture.detectChanges();

    tick(300);

    discardPeriodicTasks();

    expect(roleNameFilter.value).toEqual('');
    expect(appFilter.value).toEqual('');
    flush();
  }));
});

const getSelectors = (hostDebug) => ({
  orgFilter: getElement(hostDebug)('org-filter')?.nativeElement,
  appFilter: getElement(hostDebug)('app-filter')?.nativeElement,
  roleNameFilter: getElement(hostDebug)('role-name-filter')?.nativeElement,
});
