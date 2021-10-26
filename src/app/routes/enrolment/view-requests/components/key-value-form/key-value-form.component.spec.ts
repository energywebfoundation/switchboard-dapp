import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { KeyValueFormComponent } from './key-value-form.component';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { dispatchInputEvent, getElement } from '@tests';

describe('KeyValueFormComponent', () => {
  let component: KeyValueFormComponent;
  let fixture: ComponentFixture<KeyValueFormComponent>;
  let hostDebug: DebugElement;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [KeyValueFormComponent],
      imports: [ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyValueFormComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not emit adding pair when form is invalid', () => {
    const addSpy = spyOn(component.add, 'emit');
    const {add} = getSelectors(hostDebug);
    add.click();
    expect(add.disabled).toBeTrue();
    expect(addSpy).not.toHaveBeenCalled();
  });

  it('should emit adding pair when form is valid', () => {
    const addSpy = spyOn(component.add, 'emit');
    const {key, value, add} = getSelectors(hostDebug);

    key.value = 'test';
    dispatchInputEvent(key);

    value.value = 'value';
    dispatchInputEvent(value);

    fixture.detectChanges();

    expect(add.disabled).toBeFalse();
    add.click();
    expect(addSpy).toHaveBeenCalled();
  });

  it('should emit cancel when clicking on cancel button', () => {
    const cancelSpy = spyOn(component.cancel, 'emit');
    const {cancel} = getSelectors(hostDebug);
    cancel.click();

    expect(cancelSpy).toHaveBeenCalled();
  });
});

const getSelectors = (hostDebug) => ({
  cancel: getElement(hostDebug)('cancel')?.nativeElement,
  add: getElement(hostDebug)('add')?.nativeElement,
  key: getElement(hostDebug)('key')?.nativeElement,
  value: getElement(hostDebug)('value')?.nativeElement,
});
