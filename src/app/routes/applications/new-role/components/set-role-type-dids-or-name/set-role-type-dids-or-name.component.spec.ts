import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SetRoleTypeDidsOrNameComponent } from './set-role-type-dids-or-name.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { getElement, getElementByCss } from '@tests';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { IssuerType } from '../../models/issuer-type.enum';

describe('SetRoleTypeDidsOrNameComponent', () => {
  let component: SetRoleTypeDidsOrNameComponent;
  let fixture: ComponentFixture<SetRoleTypeDidsOrNameComponent>;
  let hostDebug: DebugElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SetRoleTypeDidsOrNameComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetRoleTypeDidsOrNameComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
    spyOn(component.next, 'emit');
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should change type to role, clear did list and show role selection', () => {
    fixture.detectChanges();
    const { selectType } = getSelectors(hostDebug);

    selectType.click();
    fixture.detectChanges();

    const { optionRole } = getSelectors(hostDebug);

    optionRole.click();
    fixture.detectChanges();

    const { typeDID, typeRole } = getSelectors(hostDebug);
    expect(typeRole).toBeTruthy();
    expect(typeDID).toBeFalsy();
  });

  it('should display did type by default', () => {
    fixture.detectChanges();

    const { typeDID, typeRole } = getSelectors(hostDebug);
    expect(typeRole).toBeFalsy();
    expect(typeDID).toBeTruthy();
  });

  it('should emit did list on next click', () => {
    component.signerDID = 'did';
    fixture.detectChanges();
    const { next } = getSelectors(hostDebug);

    next.click();
    fixture.detectChanges();

    expect(component.next.emit).toHaveBeenCalledWith({
      type: IssuerType.DID,
      did: ['did'],
      roleName: '',
    });
  });

  it('should change select to DID and set signerDID to the list', () => {
    component.signerDID = 'signer-did';
    component.typeDefinition = {
      type: IssuerType.ROLE,
      roleName: 'roleName',
      did: [],
    };

    fixture.detectChanges();

    const { selectType, next } = getSelectors(hostDebug);

    selectType.click();
    fixture.detectChanges();

    const { optionDID } = getSelectors(hostDebug);
    optionDID.click();
    fixture.detectChanges();

    next.click();
    fixture.detectChanges();

    expect(component.next.emit).toHaveBeenCalledWith({
      type: IssuerType.DID,
      did: [component.signerDID],
      roleName: '',
    });
  });

  it('should update form and selected type', () => {
    component.signerDID = 'signer-did';
    component.typeDefinition = {
      type: IssuerType.ROLE,
      roleName: 'roleName',
      did: [],
    };

    fixture.detectChanges();

    const { typeRole, typeDID, next } = getSelectors(hostDebug);

    expect(typeRole).toBeTruthy();
    expect(typeDID).toBeFalsy();

    next.click();
    fixture.detectChanges();

    expect(component.next.emit).toHaveBeenCalledWith({
      type: IssuerType.ROLE,
      did: [],
      roleName: 'roleName',
    });
  });

  it('should update the list with issuer dids', () => {
    component.signerDID = 'signer-did';
    component.typeDefinition = {
      type: IssuerType.DID,
      roleName: undefined,
      did: ['first-did', 'second-did'],
    };

    fixture.detectChanges();

    const { next } = getSelectors(hostDebug);

    next.click();
    fixture.detectChanges();

    expect(component.next.emit).toHaveBeenCalledWith({
      type: IssuerType.DID,
      did: ['first-did', 'second-did'],
      roleName: '',
    });
  });
});

const getSelectors = (hostDebug) => {
  return {
    optionDID: getElement(hostDebug)(IssuerType.DID)?.nativeElement,
    optionRole: getElement(hostDebug)(IssuerType.ROLE)?.nativeElement,
    selectType: getElement(hostDebug)('select-type')?.nativeElement,
    next: getElement(hostDebug)('next-issuer')?.nativeElement,
    typeDID: getElementByCss(hostDebug)('app-role-type-did'),
    typeRole: getElementByCss(hostDebug)('app-search-issuer-role'),
  };
};
