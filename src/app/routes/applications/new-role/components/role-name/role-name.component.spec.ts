import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';

import { RoleNameComponent } from './role-name.component';
import { RoleCreationService } from '../../services/role-creation.service';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { dispatchInputEvent, getElement } from '@tests';
import { DomainTypeEnum } from '../../new-role.component';
import { By } from '@angular/platform-browser';
import { DomainTypePipe } from '../../../../../shared/pipes/domain-type/domain-type.pipe';

describe('RoleNameComponent', () => {
  let component: RoleNameComponent;
  let fixture: ComponentFixture<RoleNameComponent>;
  const roleCreationServiceSpy = jasmine.createSpyObj(RoleCreationService, [
    'canUseDomain',
  ]);
  let hostDebug: DebugElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RoleNameComponent, DomainTypePipe],
      imports: [
        MatIconTestingModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatInputModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: RoleCreationService, useValue: roleCreationServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleNameComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
    component.parentNamespace = 'namespace.iam.ewc';
    component.roleType = DomainTypeEnum.ORG;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check required field validation', () => {
    const { roleName } = selectors(hostDebug);

    roleName.value = '';
    dispatchInputEvent(roleName);
    fixture.detectChanges();

    const { matError } = selectors(hostDebug);
    expect(matError.textContent).toContain('Role Name is required');
  });

  it('should check minimal length field validation', () => {
    const { roleName } = selectors(hostDebug);

    roleName.value = '12';
    dispatchInputEvent(roleName);
    fixture.detectChanges();

    const { matError } = selectors(hostDebug);
    expect(matError.textContent).toContain(
      'Role Name need to have at least 3 characters.'
    );
  });

  it('should check if field contains only alphanumeric values', () => {
    const { roleName } = selectors(hostDebug);

    roleName.value = 'ąść';
    dispatchInputEvent(roleName);
    fixture.detectChanges();

    const { matError } = selectors(hostDebug);
    expect(matError.textContent).toContain(
      'Role Name can only contain alphanumeric characters.'
    );
  });

  it('should display error message with already taken role name', fakeAsync(async () => {
    roleCreationServiceSpy.canUseDomain.and.returnValue(Promise.resolve(false));
    const { roleName } = selectors(hostDebug);

    roleName.value = 'role';
    dispatchInputEvent(roleName);
    tick(100);
    fixture.detectChanges();

    const { matError } = selectors(hostDebug);
    expect(matError.textContent).toContain(
      'This name already exists. Please try another'
    );
    flush();
  }));

  it('should display ens namespace', () => {
    roleCreationServiceSpy.canUseDomain.and.returnValue(Promise.resolve(true));
    const { roleName } = selectors(hostDebug);

    roleName.value = 'example';
    dispatchInputEvent(roleName);
    fixture.detectChanges();

    const { roleNamespace } = selectors(hostDebug);

    expect(roleNamespace.textContent).toContain(
      'example.roles.namespace.iam.ewc'
    );
  });

  it('should check if emits proceed event', async () => {
    roleCreationServiceSpy.canUseDomain.and.returnValue(Promise.resolve(true));
    const { roleName } = selectors(hostDebug);
    const proceedEvent = spyOn(component.proceed, 'emit');

    roleName.value = 'role';
    dispatchInputEvent(roleName);
    fixture.detectChanges();

    await component.next();
    expect(proceedEvent).toHaveBeenCalledWith('role');
  });

  it('should emits abort event with touched equal to true property', () => {
    roleCreationServiceSpy.canUseDomain.and.returnValue(Promise.resolve(true));
    const { roleName } = selectors(hostDebug);
    const abortEvent = spyOn(component.cancel, 'emit');

    roleName.value = 'role';
    dispatchInputEvent(roleName);
    fixture.detectChanges();

    component.cancelHandler();
    expect(abortEvent).toHaveBeenCalledWith({ touched: true });
  });
});

const selectors = (hostDebug) => {
  return {
    roleName: getElement(hostDebug)('role-name')?.nativeElement,
    roleNamespace: getElement(hostDebug)('role-namespace')?.nativeElement,
    cancel: getElement(hostDebug)('cancel')?.nativeElement,
    next: getElement(hostDebug)('proceed-role-name')?.nativeElement,
    matError: hostDebug.query(By.css(`mat-error`))?.nativeElement,
  };
};
