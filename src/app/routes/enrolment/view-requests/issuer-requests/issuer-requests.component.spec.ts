import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IssuerRequestsComponent } from './issuer-requests.component';
import { TokenDecodeService } from '../services/token-decode.service';
import { DialogDataMock, dialogSpy, getElement } from '@tests';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { IssuerRequestsService } from '../services/issuer-requests.service';
import { RoleService } from '../../../../state/governance/role/services/role.service';
import { of } from 'rxjs';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

describe('IssuerRequestsComponent', () => {
  let component: IssuerRequestsComponent;
  let fixture: ComponentFixture<IssuerRequestsComponent>;
  const matDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
  const tokenDecodeSpy = jasmine.createSpyObj('TokenDecodeService', [
    'getIssuerFields',
    'getRequestorFields',
  ]);
  let issuerRequestServiceSpy;
  let roleSpy;
  let dialogMock: DialogDataMock;
  let hostDebug: DebugElement;
  beforeEach(waitForAsync(() => {
    dialogMock = new DialogDataMock();
    issuerRequestServiceSpy = jasmine.createSpyObj(IssuerRequestsService, [
      'approve',
      'reject',
    ]);
    roleSpy = jasmine.createSpyObj(RoleService, ['getDefinition']);
    TestBed.configureTestingModule({
      declarations: [IssuerRequestsComponent],
      providers: [
        { provide: TokenDecodeService, useValue: tokenDecodeSpy },
        { provide: MAT_DIALOG_DATA, useValue: dialogMock },
        { provide: MatDialogRef, useValue: matDialogRefSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: IssuerRequestsService, useValue: issuerRequestServiceSpy },
        { provide: RoleService, useValue: roleSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    dialogMock.setData({
      claimData: {
        isRevokedOnChain: false,
        isRevokedOffChain: false,
        isAccepted: false,
        isRejected: false,
        roleName: 'test',
        issuedToken: 'issued-token',
        token: 'token',
      },
    });
    fixture = TestBed.createComponent(IssuerRequestsComponent);
    component = fixture.componentInstance;
    roleSpy.getDefinition.and.returnValue(of({}));

    tokenDecodeSpy.getIssuerFields.and.returnValue(of([]));
    tokenDecodeSpy.getRequestorFields.and.returnValue(of([]));
    hostDebug = fixture.debugElement;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display role name', () => {
    fixture.detectChanges();

    const { roleName } = getSelectors(hostDebug);

    expect(roleName.innerText).toEqual('TEST');
  });

  it('should display few components', () => {
    fixture.detectChanges();

    const { requestorFields, requestDetails, issuerFields, expirationDate } =
      getSelectors(hostDebug);

    expect(requestorFields).toBeTruthy();
    expect(requestDetails).toBeTruthy();
    expect(issuerFields).toBeTruthy();
    expect(expirationDate).toBeTruthy();
  });
});

const getSelectors = (hostDebug) => ({
  roleName: getElement(hostDebug)('role-name')?.nativeElement,
  requestDetails: getElement(hostDebug)('request-details')?.nativeElement,
  requestorFields: getElement(hostDebug)('requestor-fields')?.nativeElement,
  issuerFields: getElement(hostDebug)('issuer-fields')?.nativeElement,
  enrolmentIssuerFields: getElement(hostDebug)('enrolment-issuer-fields')
    ?.nativeElement,
  expirationDate: getElement(hostDebug)('expiration-date')?.nativeElement,
  approveBtn: getElement(hostDebug)('approve-btn')?.nativeElement,
  rejectBtn: getElement(hostDebug)('reject-btn')?.nativeElement,
});
