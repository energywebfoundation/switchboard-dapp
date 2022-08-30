import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ViewRequestsComponent } from './view-requests.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { provideMockStore } from '@ngrx/store/testing';
import { TokenDecodeService } from './services/token-decode.service';
import { getElement } from '@tests';
import { ChangeDetectionStrategy } from '@angular/compiler';

class MatDialogDataMock {
  setData(value: any) {
    Object.assign(this, value);
  }
}
describe('ViewRequestsComponent', () => {
  let component: ViewRequestsComponent;
  let fixture: ComponentFixture<ViewRequestsComponent>;
  const tokenDecodeSpy = jasmine.createSpyObj('TokenDecodeService', [
    'getIssuerFields',
    'getRequestorFields',
  ]);
  let testClaimData: MatDialogDataMock;
  let hostDebug: DebugElement;
  beforeEach(waitForAsync(() => {
    testClaimData = new MatDialogDataMock();
    TestBed.configureTestingModule({
      declarations: [ViewRequestsComponent],
      providers: [
        provideMockStore(),
        { provide: TokenDecodeService, useValue: tokenDecodeSpy },
        {
          provide: MAT_DIALOG_DATA,
          useValue: testClaimData,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(ViewRequestsComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRequestsComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show the JSON credential components if the claim is not accepted', () => {
    testClaimData.setData({
      claimData: { claimType: 'request-test', isIssued: false },
    });
    fixture.detectChanges();
    const credentialJSON = getElement(hostDebug)('raw-credential');
    const eip191JSON = getElement(hostDebug)('raw-eip191');
    expect(credentialJSON).toBeFalsy();
    expect(eip191JSON).toBeFalsy();
  });
  it('should show the EIP-191 JSON component if the claim is accepted and has a decoded token', () => {
    testClaimData.setData({
      claimData: {
        canShowRawEip191: true,
        isIssued: true,
        claimType: 'request-test',
        decodedToken: {
          iss: 'string',
        },
      },
    });
    fixture.detectChanges();
    const eip191JSON = getElement(hostDebug)('raw-eip191');
    expect(eip191JSON).toBeTruthy();
  });
  it('should show the EIP-712 JSON component if the claim is accepted and has credential data', () => {
    testClaimData.setData({
      claimData: {
        isIssued: true,
        claimType: 'request-test',
        verifiableCredential: {
          id: '124',
        },
        canShowRawEip712: true,
      },
    });
    fixture.detectChanges();
    const credentialJSON = getElement(hostDebug)('raw-credential');
    expect(credentialJSON).toBeTruthy();
  });
  it('should have a header of "Credential" if the claim has been issued', () => {
    testClaimData.setData({
      claimData: {
        isIssued: true,
        claimType: 'request-test',
        verifiableCredential: {
          id: '124',
        },
      },
    });
    fixture.detectChanges();
    expect(component.header).toEqual('Credential');
  });
  it('should have a header of "Credential Request" if the claim has not been issued', () => {
    testClaimData.setData({
      claimData: {
        isIssued: false,
        claimType: 'request-test',
        verifiableCredential: {
          id: '124',
        },
      },
    });
    fixture.detectChanges();
    expect(component.header).toEqual('Credential Request');
  });
});
