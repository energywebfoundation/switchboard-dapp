import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewIssueVcComponent } from './new-issue-vc.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IssuanceVcService } from '../services/issuance-vc.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { dialogSpy, dispatchInputEvent, getElement } from '@tests';
import { of } from 'rxjs';

class MockDialogData {
  did: string;

  get data() {
    return { did: this.did };
  }

  setDid(value) {
    this.did = value;
  }
}

describe('NewIssueVCComponent', () => {
  let component: NewIssueVcComponent;
  let fixture: ComponentFixture<NewIssueVcComponent>;
  const issuanceVcServiceSpy = jasmine.createSpyObj('IssuanceVcService', [
    'create',
    'getNotEnrolledRoles',
  ]);
  let mockDialogData;
  let hostDebug: DebugElement;
  beforeEach(waitForAsync(() => {
    mockDialogData = new MockDialogData();
    TestBed.configureTestingModule({
      declarations: [NewIssueVcComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule,
        MatIconTestingModule,
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: MatDialogRef, useValue: dialogSpy },
        { provide: IssuanceVcService, useValue: issuanceVcServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewIssueVcComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
    issuanceVcServiceSpy.getNotEnrolledRoles.and.returnValue(
      of([
        {
          name: 'role',
          namespace: 'role.roles.test.iam.ewc',
          definition: {
            issuer: {
              did: ['did:ethr:0xA028720Bc0cc22d296DCD3a26E7E8AAe73c9B6F3'],
              issuerType: 'DID',
            },
            version: 2,
            metadata: {},
            roleName: 'issuerfields',
          },
        },
      ])
    );
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should disable did control when did is predefined and display list of roles', () => {
    mockDialogData.setDid(
      'did:ethr:0x925b597D2a6Ac864D4a1CA31Dd65a1904f0F2e89'
    );
    fixture.detectChanges();

    const { subjectDid, selectType } = getSelectors(hostDebug);

    expect(component.isDidPredefined()).toBeTrue();
    expect(subjectDid.disabled).toBeTrue();
    expect(selectType).toBeTruthy();
  });

  it('should create set did and role for new vc.', () => {
    issuanceVcServiceSpy.create.and.returnValue(of());
    fixture.detectChanges();

    const { subjectDid } = getSelectors(hostDebug);

    subjectDid.value = 'did:ethr:0x925b597D2a6Ac864D4a1CA31Dd65a1904f0F2e89';
    dispatchInputEvent(subjectDid);

    fixture.detectChanges();

    const { selectType } = getSelectors(hostDebug);
    selectType.click();
    fixture.detectChanges();

    getElement(hostDebug)('role').nativeElement.click();

    fixture.detectChanges();
    expect(component.isFormDisabled()).toBeFalse();
  });

  it('should not display role list when did is invalid', () => {
    fixture.detectChanges();

    const { subjectDid } = getSelectors(hostDebug);

    subjectDid.value = 'invalid did';
    dispatchInputEvent(subjectDid);

    fixture.detectChanges();

    const { selectType } = getSelectors(hostDebug);

    expect(component.isFormSubjectValid()).toBeFalse();
    expect(selectType).toBeFalsy();
  });

  it('should check if form is enabled when form is valid and precheck is true', () => {
    component
      .getFormSubject()
      .setValue('did:ethr:0x925b597D2a6Ac864D4a1CA31Dd65a1904f0F2e89');
    component.getFormType().setValue('test');
    component.isPrecheckSuccess = true;
    fixture.detectChanges();
    expect(component.isFormDisabled()).toBeFalse();
  });

  it('should check if form is disabled when precheck is false', () => {
    component
      .getFormSubject()
      .setValue('did:ethr:0x925b597D2a6Ac864D4a1CA31Dd65a1904f0F2e89');
    component.getFormType().setValue('test');
    component.isPrecheckSuccess = false;
    fixture.detectChanges();
    expect(component.isFormDisabled()).toBeTrue();
  });

  it('should check if form is disabled when did is incorrect', () => {
    component
      .getFormSubject()
      .setValue('did:ethr:0x925b597D2a6Ac8D4a1CA31Dd65a1904f0F2e89');
    component.getFormType().setValue('test');
    component.isPrecheckSuccess = true;
    fixture.detectChanges();
    expect(component.isFormDisabled()).toBeTrue();
  });

  it('scannedValue should patch subject property', () => {
    fixture.detectChanges();
    const value = 'did:ethr:0x925b597D2a6Ac8D4a1CA31Dd65a1904f0F2e89';
    component.scannedValue(value);
    expect(component.getFormSubject().value).toEqual(value);
  });
});

const getSelectors = (hostDebug) => {
  return {
    subjectDid: getElement(hostDebug)('subject-did')?.nativeElement,
    selectType: getElement(hostDebug)('select-type')?.nativeElement,
  };
};
