import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { provideMockStore } from '@ngrx/store/testing';

import { NewRoleComponent } from './new-role.component';
import { IamService } from '../../../shared/services/iam.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PreconditionTypes } from 'iam-client-lib';

describe('NewRoleComponent', () => {
  let component: NewRoleComponent;
  let fixture: ComponentFixture<NewRoleComponent>;
  const fb = new FormBuilder();
  const matDialogSpy = jasmine.createSpyObj('MatDialog',
    [
      'closeAll',
    ]);
  const toastrSpy = jasmine.createSpyObj('ToastrService',
    [
      'success',
      'error'
    ]);
  const iamSpy = jasmine.createSpyObj('iam', [
    'getDid',
    'checkExistenceOfDomain',
    'isOwner',
    'getRoleDIDs',
    'createRole',
    'setRoleDefinition',
    'getENSTypesBySearchPhrase'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewRoleComponent],
      imports: [ReactiveFormsModule],
      providers: [
        provideMockStore(),
        {provide: IamService, useValue: {iam: iamSpy}},
        {provide: ToastrService, useValue: toastrSpy},
        {provide: MatDialogRef, useValue: {}},
        {provide: MatDialog, useValue: matDialogSpy},
        {provide: MAT_DIALOG_DATA, useValue: {}}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRoleComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be run removeDid', () => {
    const i = 1;
    component.issuerList = ['1', '2', '3'];
    component.removeDid(i);

    expect(component.issuerList).toEqual(['1', '3']);

    component.issuerList = ['1'];
    component.removeDid(0);

    expect(component.issuerList).toEqual(['1']);
  });

  it('should be run formResetHandler', () => {
    spyOn(component.fieldsForm, 'reset');

    component.formResetHandler();

    expect(component.fieldsForm.reset).toHaveBeenCalled();
  });

  it('should be run clearSearchTxt', () => {
    const testValue = 'roleForm';
    const expectedResult = false;
    component.roleControl = fb.control({testValue});

    component.clearSearchTxt();

    expect(component.roleControl.value).toBe('');
  });

  it('should be run removePreconditionRole', () => {
    const index = 1;
    component.roleForm = fb.group({
      data: fb.group({
        enrolmentPreconditions:
          [
            [
              {type: PreconditionTypes.Role, conditions: ['a', 'b', 'c', 'd']},
            ]
          ]
      })
    });
    component.removePreconditionRole(index);
    expect(component.roleForm.get('data').get('enrolmentPreconditions').value[0].conditions).toEqual(['a', 'c', 'd']);
  });

  it('should be run displayFn', () => {
    const selectedFirst = {namespace: 'value'};
    const selectedSecond = {namespace: null};

    const resultFirst = component.displayFn(selectedFirst);
    const resultSecond = component.displayFn(selectedSecond);
    expect(resultFirst).toBe('value');
    expect(resultSecond).toBe('');
  });

  describe('should be run addDid', () => {
    it('addDid: newIssuer === issuerGroup', () => {
      const newIssuer = 'test value';
      component.issuerList = [newIssuer];
      component.issuerGroup = fb.group({
        newIssuer
      });

      component.addDid();

      expect(toastrSpy.error).toHaveBeenCalled();
    });

    it('addDid: newIssuer !== issuerGroup', () => {
      const newIssuer = 'test value';
      const issuer = 'issuerGroup value';
      component.issuerList = [issuer];
      component.issuerGroup = fb.group({
        newIssuer
      });
      spyOn(component.issuerGroup.get('newIssuer'), 'reset');

      component.addDid();

      expect(component.issuerList[1]).toBe(newIssuer);
      expect(component.issuerGroup.get('newIssuer').reset).toHaveBeenCalled();
    });

    it('addDid: newIssuer is empty', () => {
      const newIssuer = '    ';
      const issuer = 'issuerGroup value';
      component.issuerList = [issuer];
      component.issuerGroup = fb.group({
        newIssuer
      });
      spyOn(component.issuerGroup.get('newIssuer'), 'reset');

      component.addDid();

      expect(component.issuerGroup.get('newIssuer').reset).not.toHaveBeenCalled();
      expect(toastrSpy.error).toHaveBeenCalled();
    });
  });

  describe('should be run issuerTypeChanged', () => {
    let data;

    beforeEach(() => {
      component.issuerGroup = fb.group({});
      data = {value: 'test value'};
      component.roleForm = fb.group({
        data: fb.group({
          issuer: fb.group({
            roleName: ''
          })
        })
      });
      spyOn(component.issuerGroup, 'reset');
      spyOn(component.roleForm.get('data').get('issuer').get('roleName'), 'reset');
      component.IssuerType = {
        DID: 'DID',
        Role: 'Role'
      };
    });

    it('issuerList length > 0', () => {
      component.issuerList = ['1', '2'];

      component.issuerTypeChanged(data);

      expect(component.issuerGroup.reset).toHaveBeenCalled();
      expect(component.issuerList.length).toBe(0);
      expect(component.roleForm.get('data').get('issuer').get('roleName').reset).toHaveBeenCalled();
    });

    it('iIssuerType.DID === data.value', () => {
      data = {value: component.IssuerType.DID};
      component.issuerList = [];

      component.issuerTypeChanged(data);

      expect(component.issuerGroup.reset).toHaveBeenCalled();
      expect(component.roleForm.get('data').get('issuer').get('roleName').reset).toHaveBeenCalled();
      expect(component.issuerList.length).toBe(1);
    });
  });

});
