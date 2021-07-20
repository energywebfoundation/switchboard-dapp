import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { provideMockStore } from '@ngrx/store/testing';

import { NewRoleComponent, RoleType } from './new-role.component';
import { IamService } from '../../../shared/services/iam.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('NewRoleComponent', () => {
  let component: NewRoleComponent;
  let fixture: ComponentFixture<NewRoleComponent>;
  const fb = new FormBuilder();
  const toastrSpy = jasmine.createSpyObj('ToastrService', ['success']);
  const iamSpy = jasmine.createSpyObj('iam', [
      'getDid',
    'checkExistenceOfDomain',
    'isOwner',
    'getRoleDIDs',
    'createRole',
    'setRoleDefinition',
    'getENSTypesBySearchPhrase'
  ]);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRoleComponent ],
      imports: [ReactiveFormsModule],
      providers: [
        provideMockStore(),
        { provide: IamService, useValue: { iam: iamSpy, isAlphaNumericOnly: (a, b) => {}}},
        { provide: ToastrService, useValue: toastrSpy },
        { provide: MatDialogRef, useValue: {} },
        { provide: MatDialog, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRoleComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('should be run', () => {

    it('removeDid', () => {
      const i = 1;
      component.issuerList = ['1', '2', '3'];
      component.removeDid(i);

      expect(component.issuerList).toEqual(['1', '3']);

      component.issuerList = ['1'];
      component.removeDid(0);

      expect(component.issuerList).toEqual(['1']);
    });

    it('formResetHandler', () => {
      spyOn(component.fieldsForm, 'reset');

      component.formResetHandler();

      expect(component.fieldsForm.reset).toHaveBeenCalled();
    });

    it('dataSourceChangeHandler', () => {
      const data = ['test value'];

      component.dataSourceChangeHandler(data);

      expect(component.dataSource.data).toEqual(data);
    });
  });
});
