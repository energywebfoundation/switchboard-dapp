import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewArbitraryCredentialComponent } from './new-arbitrary-credential.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IssuanceVcService } from '../services/issuance-vc.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { dispatchInputEvent, getElement } from '@tests';

export class MockDialogData {
  did: string;

  get data() {
    return {did: this.did};
  }

  setDid(value) {
    this.did = value;
  }
}

describe('NewArbitraryCredentialComponent', () => {
  let component: NewArbitraryCredentialComponent;
  let fixture: ComponentFixture<NewArbitraryCredentialComponent>;
  const issuanceVcServiceSpy = jasmine.createSpyObj('IssuanceVcService', ['create']);
  let mockDialogData;
  let hostDebug: DebugElement;
  beforeEach(waitForAsync(() => {
    mockDialogData = new MockDialogData();
    TestBed.configureTestingModule({
      declarations: [NewArbitraryCredentialComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule,
        MatIconTestingModule
      ],
      providers: [
        {provide: MAT_DIALOG_DATA, useValue: mockDialogData},
        {provide: IssuanceVcService, useValue: issuanceVcServiceSpy},

      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewArbitraryCredentialComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should disable did control when did is predefined', () => {
    mockDialogData.setDid('did:ethr:0x925b597D2a6Ac864D4a1CA31Dd65a1904f0F2e89');
    fixture.detectChanges();

    const {issueDid} = getSelectors(hostDebug);

    expect(component.isDidPredefined()).toBeTrue();
    expect(issueDid.disabled).toBeTrue();
  });

  it('should create new VC', () => {
    fixture.detectChanges();

    const {issueDid, selectType, name, createBtn} = getSelectors(hostDebug);

    issueDid.value = 'did:ethr:0x925b597D2a6Ac864D4a1CA31Dd65a1904f0F2e89';
    dispatchInputEvent(issueDid);

    name.value = 'Name';
    dispatchInputEvent(name);

    selectType.click();
    fixture.detectChanges();

    getElement(hostDebug)('owner').nativeElement.click();

    fixture.detectChanges();

    expect(createBtn.disabled).toBeFalse();

    createBtn.click();
    expect(issuanceVcServiceSpy.create).toHaveBeenCalled();
  });
});

const getSelectors = (hostDebug) => {
  return {
    issueDid: getElement(hostDebug)('issue-did')?.nativeElement,
    selectType: getElement(hostDebug)('select-type')?.nativeElement,
    name: getElement(hostDebug)('name')?.nativeElement,
    createBtn: getElement(hostDebug)('create')?.nativeElement
  };
};
