import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { provideMockStore } from '@ngrx/store/testing';

import { NewRoleComponent } from './new-role.component';
import { IamService } from '../../../shared/services/iam.service';
import { ToastrService } from 'ngx-toastr';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PreconditionType } from 'iam-client-lib';
import { SignerFacadeService } from '../../../shared/services/signer-facade/signer-facade.service';
import { DomainTypePipe } from '../../../shared/pipes/domain-type/domain-type.pipe';
import { TimeDurationPipe } from '../../../shared/pipes/time-duration/time-duration.pipe';

describe('NewRoleComponent', () => {
  let component: NewRoleComponent;
  let fixture: ComponentFixture<NewRoleComponent>;
  const fb = new FormBuilder();
  const matDialogSpy = jasmine.createSpyObj('MatDialog', ['closeAll']);
  const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);
  const iamSpy = jasmine.createSpyObj('iam', [
    'checkExistenceOfDomain',
    'isOwner',
    'getRoleDIDs',
    'createRole',
    'setRoleDefinition',
    'getENSTypesBySearchPhrase',
  ]);

  const signerFacadeSpy = jasmine.createSpyObj(SignerFacadeService, ['getDid']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewRoleComponent, DomainTypePipe, TimeDurationPipe],
      imports: [ReactiveFormsModule],
      providers: [
        provideMockStore(),
        { provide: IamService, useValue: { iam: iamSpy } },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: MatDialogRef, useValue: {} },
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: SignerFacadeService, useValue: signerFacadeSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRoleComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be run removePreconditionRole', () => {
    const index = 1;
    component.roleForm = fb.group({
      data: fb.group({
        enrolmentPreconditions: [
          [{ type: PreconditionType.Role, conditions: ['a', 'b', 'c', 'd'] }],
        ],
      }),
    });
    component.removePreconditionRole(index);
    expect(
      component.roleForm.get('data').get('enrolmentPreconditions').value[0]
        .conditions
    ).toEqual(['a', 'c', 'd']);
  });

  it('should be run displayFn', () => {
    const selectedFirst = { namespace: 'value' };
    const selectedSecond = { namespace: null };

    const resultFirst = component.displayFn(selectedFirst);
    const resultSecond = component.displayFn(selectedSecond);
    expect(resultFirst).toBe('value');
    expect(resultSecond).toBe('');
  });

  describe('should be run issuerTypeChanged', () => {
    let data;

    beforeEach(() => {
      data = { value: 'test value' };
      component.roleForm = fb.group({
        data: fb.group({
          issuer: fb.group({
            roleName: '',
          }),
        }),
      });
    });
  });
});
