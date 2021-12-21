import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RoleNameComponent } from './role-name.component';
import { RoleCreationService } from '../../services/role-creation.service';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { dispatchInputEvent, getElement } from '@tests';
import { RoleTypeEnum } from '../../new-role.component';
import { By } from '@angular/platform-browser';
import { RoleTypePipe } from '../../pipes/role-type.pipe';

describe('RoleNameComponent', () => {
  let component: RoleNameComponent;
  let fixture: ComponentFixture<RoleNameComponent>;
  const roleCreationServiceSpy = jasmine.createSpyObj(RoleCreationService, ['checkIfUserCanUseDomain']);
  let hostDebug: DebugElement;

  beforeEach(waitForAsync((() => {
    TestBed.configureTestingModule({
      declarations: [RoleNameComponent, RoleTypePipe],
      imports: [
        MatIconTestingModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatInputModule,
        NoopAnimationsModule
      ],
      providers: [
        {provide: RoleCreationService, useValue: roleCreationServiceSpy}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  })));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleNameComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should check required field validation', () => {
    component.parentNamespace = 'namespace';
    component.roleType = RoleTypeEnum.ORG;
    fixture.detectChanges();
    const {roleName} = selectors(hostDebug);

    roleName.value = '';
    dispatchInputEvent(roleName);
    fixture.detectChanges();

    const {matError} = selectors(hostDebug);
    expect(matError.textContent).toContain('Role Name is required');
  });
  it('should check minimal length field validation', () => {
    component.parentNamespace = 'namespace';
    component.roleType = RoleTypeEnum.ORG;
    fixture.detectChanges();
    const {roleName} = selectors(hostDebug);

    roleName.value = '12';
    dispatchInputEvent(roleName);
    fixture.detectChanges();

    const {matError} = selectors(hostDebug);
    expect(matError.textContent).toContain('Role Name need to have at least 3 characters.');
  });

  it('should check if field contains only alphanumeric values', () => {
    component.parentNamespace = 'namespace';
    component.roleType = RoleTypeEnum.ORG;
    fixture.detectChanges();
    const {roleName} = selectors(hostDebug);

    roleName.value = 'ąść';
    dispatchInputEvent(roleName);
    fixture.detectChanges();

    const {matError} = selectors(hostDebug);
    expect(matError.textContent).toContain('Role Name can only contain alphanumeric characters.');
  });

  it('should display error message with already taken role name', async () => {
    roleCreationServiceSpy.checkIfUserCanUseDomain.and.returnValue(Promise.resolve(false));

    component.parentNamespace = 'namespace';
    component.roleType = RoleTypeEnum.ORG;

    fixture.detectChanges();
    const {roleName} = selectors(hostDebug);

    roleName.value = 'role';
    dispatchInputEvent(roleName);
    fixture.detectChanges();

    await component.next();
    // Some additional reloads occurs when using below code.
    // const {next} = selectors(hostDebug);
    // next.click();
    fixture.detectChanges();

    expect(component.existAndNotOwner).toBeTrue();
    const {matError} = selectors(hostDebug);
    expect(matError.textContent).toContain('This name already exists. Please try another');
  });
});

const selectors = (hostDebug) => {
  return {
    roleName: getElement(hostDebug)('role-name')?.nativeElement,
    roleNamespace: getElement(hostDebug)('role-namespace')?.nativeElement,
    cancel: getElement(hostDebug)('cancel')?.nativeElement,
    next: getElement(hostDebug)('proceed')?.nativeElement,
    matError: hostDebug.query(By.css(`mat-error`))?.nativeElement
  };
};
