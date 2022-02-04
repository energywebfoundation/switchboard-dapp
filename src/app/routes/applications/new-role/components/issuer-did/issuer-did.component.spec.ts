import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IssuerDidComponent } from './issuer-did.component';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { dispatchInputEvent, getElement } from '@tests';
import { By } from '@angular/platform-browser';

describe('IssuerDidComponent', () => {
  let component: IssuerDidComponent;
  let fixture: ComponentFixture<IssuerDidComponent>;
  let hostDebug: DebugElement;
  const stringWithLength = (length): string => {
    return new Array(length + 1).join('a');
  };
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [IssuerDidComponent],
        imports: [
          ReactiveFormsModule,
          MatButtonModule,
          MatInputModule,
          MatIconTestingModule,
          NoopAnimationsModule,
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuerDidComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display error message about already existing element ', () => {
    component.issuerList = ['did:ethr:0x' + stringWithLength(40)];
    fixture.detectChanges();

    const { didInput } = selectors(hostDebug);
    didInput.value = 'did:ethr:0x' + stringWithLength(40);
    dispatchInputEvent(didInput);
    fixture.detectChanges();

    const { matError } = selectors(hostDebug);
    expect(matError.textContent).toContain(
      'This DID already exist on the list'
    );
  });

  it('should display error message when element is not a did', () => {
    component.issuerList = ['did:ethr:0x' + stringWithLength(40)];
    fixture.detectChanges();

    const { didInput } = selectors(hostDebug);
    didInput.value = 'did:ethr:0x';
    dispatchInputEvent(didInput);
    fixture.detectChanges();

    const { matError } = selectors(hostDebug);
    expect(matError.textContent).toContain('DID format is invalid');
  });

  it('should remove element from the list', () => {
    component.issuerList = [
      'did:ethr:0x' + stringWithLength(40),
      'did:ethr:0xb' + stringWithLength(39),
    ];
    fixture.detectChanges();

    component.removeIssuer(1);
    expect(component.list.length).toEqual(1);
  });

  it('should add element to the list', () => {
    component.issuerList = ['did:ethr:0x' + stringWithLength(40)];
    fixture.detectChanges();

    const { didInput } = selectors(hostDebug);
    didInput.value = 'did:ethr:0xb' + stringWithLength(39);
    dispatchInputEvent(didInput);
    fixture.detectChanges();

    const { addButton } = selectors(hostDebug);
    addButton.click();

    expect(component.list.length).toEqual(2);
  });
});

const selectors = (hostDebug) => {
  return {
    didInput: getElement(hostDebug)('did')?.nativeElement,
    addButton: getElement(hostDebug)('add-did')?.nativeElement,
    issuersLength: getElement(hostDebug)('issuers-length')?.nativeElement,
    matError: hostDebug.query(By.css(`mat-error`))?.nativeElement,
  };
};
