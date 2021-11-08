import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DidBookFormComponent } from './did-book-form.component';
import { dispatchInputEvent, getElement } from '@tests';
import { ReactiveFormsModule } from '@angular/forms';

describe('DidBookFormComponent', () => {
  let component: DidBookFormComponent;
  let fixture: ComponentFixture<DidBookFormComponent>;
  let hostDebug;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [DidBookFormComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DidBookFormComponent);
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
    const {label, did, add} = getSelectors(hostDebug);

    label.value = 'test';
    dispatchInputEvent(label);

    did.value = 'value';
    dispatchInputEvent(did);

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
  label: getElement(hostDebug)('label')?.nativeElement,
  did: getElement(hostDebug)('did')?.nativeElement,
});