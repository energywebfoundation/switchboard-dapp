import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FieldFormComponent } from './field-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FieldValidationService } from '../../../../../shared/services/field-validation.service';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { dispatchInputEvent, getElement, getElementByCss } from '@tests';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FieldTypesEnum } from './field-form.enum';

describe('FieldFormComponent', () => {
  let component: FieldFormComponent;
  let fixture: ComponentFixture<FieldFormComponent>;
  let hostDebug: DebugElement;
  const fieldValidationService = jasmine.createSpyObj('FieldFormComponent', [
    'numberRangeValid',
    'autoRangeControls',
  ]);
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FieldFormComponent],
      imports: [
        ReactiveFormsModule,
        MatSelectModule,
        NoopAnimationsModule,
        MatInputModule,
        MatCheckboxModule,
      ],
      providers: [
        { provide: FieldValidationService, useValue: fieldValidationService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldFormComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should emit added after clicking added when defining label and boolean type', () => {
    fixture.detectChanges();
    const { fieldType, fieldLabel } = getSelectors(hostDebug);
    const addedSpy = spyOn(component.added, 'emit');
    fieldLabel.value = 'Label';
    dispatchInputEvent(fieldLabel);

    fieldType.click();
    fixture.detectChanges();
    getElement(hostDebug)('boolean').nativeElement.click();
    fixture.detectChanges();

    const { addBtn } = getSelectors(hostDebug);

    expect(addBtn.disabled).toBeFalse();
    addBtn.click();

    expect(addedSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        fieldType: 'boolean',
        label: 'Label',
        required: null,
      })
    );
  });

  it('should emit added after defining fields for text type', () => {
    fixture.detectChanges();
    const { fieldType, fieldLabel } = getSelectors(hostDebug);
    const addedSpy = spyOn(component.added, 'emit');
    fieldLabel.value = 'Text Label';
    dispatchInputEvent(fieldLabel);

    fieldType.click();
    fixture.detectChanges();
    getElement(hostDebug)('text').nativeElement.click();
    fixture.detectChanges();

    const { addBtn, minLength, maxLength, pattern } = getSelectors(hostDebug);

    minLength.value = 1;
    dispatchInputEvent(minLength);
    maxLength.value = 3;
    dispatchInputEvent(maxLength);
    pattern.value = 'aa';
    dispatchInputEvent(pattern);

    fixture.detectChanges();

    expect(addBtn.disabled).toBeFalse();
    addBtn.click();

    expect(addedSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        fieldType: 'text',
        label: 'Text Label',
        required: null,
        minLength: 1,
        maxLength: 3,
        pattern: 'aa',
      })
    );
  });

  it('should emit added after defining fields for number type', () => {
    fixture.detectChanges();
    const { fieldType, fieldLabel } = getSelectors(hostDebug);
    const addedSpy = spyOn(component.added, 'emit');
    fieldLabel.value = 'Number Label';
    dispatchInputEvent(fieldLabel);

    fieldType.click();
    fixture.detectChanges();
    getElement(hostDebug)('number').nativeElement.click();
    fixture.detectChanges();

    const { addBtn, maxValue, minValue } = getSelectors(hostDebug);

    minValue.value = 1;
    dispatchInputEvent(minValue);
    maxValue.value = 3;
    dispatchInputEvent(maxValue);

    fixture.detectChanges();

    expect(addBtn.disabled).toBeFalse();
    addBtn.click();

    expect(addedSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        fieldType: 'number',
        label: 'Number Label',
        required: null,
        maxValue: 3,
        minValue: 1,
      })
    );
  });

  it('should emit added after defining fields for date type', () => {
    fixture.detectChanges();
    const { fieldType, fieldLabel } = getSelectors(hostDebug);
    const addedSpy = spyOn(component.added, 'emit');
    fieldLabel.value = 'Date Label';
    dispatchInputEvent(fieldLabel);

    fieldType.click();
    fixture.detectChanges();
    getElement(hostDebug)('date').nativeElement.click();
    fixture.detectChanges();

    const { addBtn, fieldRequired } = getSelectors(hostDebug);

    fieldRequired.click();

    fixture.detectChanges();

    expect(addBtn.disabled).toBeFalse();
    addBtn.click();

    expect(addedSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        fieldType: 'date',
        label: 'Date Label',
        required: true,
        minDate: null,
        maxDate: null,
      })
    );
  });

  it('should update data depending on passed values', () => {
    const updateSpy = spyOn(component.updated, 'emit');
    component.data = {
      fieldType: 'text',
      label: 'Text Label',
      required: true,
      minLength: 1,
      maxLength: 3,
      pattern: 'aa',
    };
    fixture.detectChanges();

    const {
      fieldLabel,
      fieldRequired,
      minLength,
      maxLength,
      pattern,
      updateBtn,
    } = getSelectors(hostDebug);

    expect(component.isText).toBeTrue();
    expect(
      component.fieldsForm.get('validation').get('required').value
    ).toBeTrue();
    expect(fieldLabel.value).toEqual('Text Label');
    expect(minLength.value).toEqual('1');
    expect(maxLength.value).toEqual('3');
    expect(pattern.value).toEqual('aa');
    expect(component.editMode).toBeTrue();

    fieldRequired.click();
    fixture.detectChanges();

    expect(updateBtn.disabled).toBeFalse();
    updateBtn.click();

    expect(updateSpy).toHaveBeenCalledWith({
      fieldType: 'text',
      label: 'Text Label',
      required: false,
      minLength: 1,
      maxLength: 3,
      pattern: 'aa',
    });
  });

  it('should add json data ', () => {
    const schemaValue = '{"year":{"label":"123"}}';
    fixture.detectChanges();
    const { fieldType, fieldLabel } = getSelectors(hostDebug);
    const addedSpy = spyOn(component.added, 'emit');
    fieldLabel.value = 'Json Label';
    dispatchInputEvent(fieldLabel);

    fieldType.click();
    fixture.detectChanges();
    getElement(hostDebug)(FieldTypesEnum.Json).nativeElement.click();
    fixture.detectChanges();

    const { addBtn, schema } = getSelectors(hostDebug);

    expect(addBtn.disabled).toBeFalse();

    schema.value = schemaValue;
    dispatchInputEvent(schema);
    fixture.detectChanges();

    addBtn.click();

    expect(addedSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        fieldType: 'json',
        label: 'Json Label',
        required: null,
        schema: schemaValue,
      })
    );
  });

  it('should display invalid json error ', () => {
    const schemaValue = "{year:{label:'123'}";
    fixture.detectChanges();
    const { fieldType, fieldLabel } = getSelectors(hostDebug);
    fieldLabel.value = 'Json Label';
    dispatchInputEvent(fieldLabel);

    fieldType.click();
    fixture.detectChanges();
    getElement(hostDebug)(FieldTypesEnum.Json).nativeElement.click();
    fixture.detectChanges();

    const { schema } = getSelectors(hostDebug);

    schema.value = schemaValue;
    dispatchInputEvent(schema);
    fixture.detectChanges();

    const { addBtn } = getSelectors(hostDebug);
    expect(addBtn.disabled).toBeTrue();
    expect(
      getElementByCss(hostDebug)('mat-error')?.nativeElement.innerText
    ).toContain('Invalid JSON Schema');
  });
});

const getSelectors = (hostDebug) => {
  return {
    fieldLabel: getElement(hostDebug)('field-label')?.nativeElement,
    fieldType: getElement(hostDebug)('field-type')?.nativeElement,
    fieldRequired: getElement(hostDebug)('field-required')?.nativeElement,
    minLength: getElement(hostDebug)('field-min-length')?.nativeElement,
    maxLength: getElement(hostDebug)('field-max-length')?.nativeElement,
    pattern: getElement(hostDebug)('pattern')?.nativeElement,
    minValue: getElement(hostDebug)('field-min-value')?.nativeElement,
    maxValue: getElement(hostDebug)('field-max-value')?.nativeElement,
    minDate: getElement(hostDebug)('field-min-date')?.nativeElement,
    maxDate: getElement(hostDebug)('field-max-date')?.nativeElement,
    updateBtn: getElement(hostDebug)('update-field')?.nativeElement,
    schema: getElement(hostDebug)('schema')?.nativeElement,
    addBtn: getElement(hostDebug)('add-field')?.nativeElement,
  };
};
