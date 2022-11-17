import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DidBookFormComponent } from './did-book-form.component';
import {
  dispatchInputEvent,
  getElement,
  getElementByCss,
  TestHelper,
} from '@tests';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('DidBookFormComponent', () => {
  let component: DidBookFormComponent;
  let fixture: ComponentFixture<DidBookFormComponent>;
  let hostDebug;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        NoopAnimationsModule,
      ],
      declarations: [DidBookFormComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DidBookFormComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not emit adding pair when form is invalid', () => {
    fixture.detectChanges();
    const addSpy = spyOn(component.add, 'emit');
    const { add } = getSelectors(hostDebug);
    add.click();
    expect(add.disabled).toBeTrue();
    expect(addSpy).not.toHaveBeenCalled();
  });

  it('should emit adding pair when form is valid', () => {
    fixture.detectChanges();
    const addSpy = spyOn(component.add, 'emit');
    const { label, did, add } = getSelectors(hostDebug);

    label.value = 'test';
    dispatchInputEvent(label);

    did.value = 'did:ethr:0xA028720Bc0cc22d296DCD3a26E7E8A1234567890';
    dispatchInputEvent(did);

    fixture.detectChanges();

    expect(add.disabled).toBeFalse();
    add.click();
    fixture.detectChanges();
    expect(addSpy).toHaveBeenCalled();
  });

  it('should emit cancel when clicking on cancel button', () => {
    component.shouldCloseForm = true;
    component.did = 'did:ethr:0xA028720Bc0cc22d296DCD3a26E7E8A1234567890';
    component.label = 'Foo Bar';
    fixture.detectChanges();
    const cancelSpy = spyOn(component.cancel, 'emit');
    const { cancel } = getSelectors(hostDebug);
    cancel.click();

    expect(cancelSpy).toHaveBeenCalled();
  });

  it('should set predefined values to the form', () => {
    component.did = 'did:ethr:0xA028720Bc0cc22d296DCD3a26E7E8A1234567890';
    component.label = 'Foo Bar';
    fixture.detectChanges();

    const { label, did, add } = getSelectors(hostDebug);

    expect(did.value).toEqual(component.did);
    expect(label.value).toEqual(component.label);
    expect(add.disabled).toBeFalse();
  });

  it('should display error that did already exist', () => {
    component.existingDIDs = ['did:ethr:' + TestHelper.stringWithLength(40)];
    fixture.detectChanges();

    const { label, did, add } = getSelectors(hostDebug);

    label.value = 'test';
    dispatchInputEvent(label);

    did.value = 'did:ethr:' + TestHelper.stringWithLength(40);
    dispatchInputEvent(did);

    fixture.detectChanges();

    expect(add.disabled).toBeTrue();
  });

  it('should update existing list validator', () => {
    component.existingDIDs = [
      'did:ethr:0xA028720Bc0cc22d296DCD3a26E7E8A1234567890',
    ];
    fixture.detectChanges();

    component.existingDIDs = [
      'did:ethr:0xA028720Bc0cc22d296DCD3a26E7E8A1234567891',
    ];

    const { label, did, add } = getSelectors(hostDebug);
    label.value = 'test';
    dispatchInputEvent(label);

    did.value = 'did:ethr:0xA028720Bc0cc22d296DCD3a26E7E8A1234567891';
    dispatchInputEvent(did);

    fixture.detectChanges();

    expect(add.disabled).toBeTrue();
    expect(
      getElementByCss(hostDebug)('mat-error')?.nativeElement.innerText
    ).toContain('already exist');
  });

  it('should reset inputs and validation when clicking cancel button', () => {
    component.shouldClearForm = true;
    fixture.detectChanges();
    const { clear, label } = getSelectors(hostDebug);

    label.value = 'example';
    dispatchInputEvent(label);
    fixture.detectChanges();

    clear.click();
    fixture.detectChanges();

    const { did, matError } = getSelectors(hostDebug);
    expect(label.value).toBeFalsy();
    expect(did.value).toBeFalsy();

    expect(matError).toBeFalsy();
  });
});

const getSelectors = (hostDebug) => ({
  cancel: getElement(hostDebug)('cancel')?.nativeElement,
  clear: getElement(hostDebug)('clear')?.nativeElement,
  add: getElement(hostDebug)('add')?.nativeElement,
  label: getElement(hostDebug)('label')?.nativeElement,
  did: getElement(hostDebug)('did')?.nativeElement,
  matError: getElementByCss(hostDebug)('mat-error')?.nativeElement,
});
