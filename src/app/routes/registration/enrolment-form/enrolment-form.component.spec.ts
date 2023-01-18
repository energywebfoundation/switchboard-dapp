import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EnrolmentFormComponent } from './enrolment-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RegistrationTypes } from 'iam-client-lib';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { dispatchInputEvent, getElementByCss } from '@tests';
import { FieldTypesEnum } from '../../applications/new-role/components/field-form/field-form.enum';
import { JsonEditorModule } from '@modules';

describe('EnrolmentFormComponent', () => {
  let component: EnrolmentFormComponent;
  let fixture: ComponentFixture<EnrolmentFormComponent>;
  let hostDebug: DebugElement;

  const fieldSelector = (id, postSelector = '') =>
    hostDebug.query(By.css(`[data-qa-id=field-${id}] ${postSelector}`));

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EnrolmentFormComponent],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatNativeDateModule,
        NoopAnimationsModule,
        JsonEditorModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrolmentFormComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;

    component.namespaceRegistrationRoles = new Set<RegistrationTypes>()
      .add(RegistrationTypes.OnChain)
      .add(RegistrationTypes.OffChain);
    component.disabledSubmit = false;
  });

  it('should create', () => {
    component.fieldList = [];
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('boolean field', () => {
    const checkboxSelector = (id, postSelector = '') =>
      hostDebug.query(By.css(`[data-qa-id=field-${id}] ${postSelector}`));
    const checkboxLabel = (id) => checkboxSelector(id, '[data-qa-id=label]');
    it('should check if optional text is displayed when checkbox is optional', () => {
      component.fieldList = [
        {
          fieldType: 'boolean',
          label: 'bbb',
          required: null,
        },
      ];

      fixture.detectChanges();

      const label = checkboxLabel(0);
      expect(label.nativeElement.innerText).toContain('(Optional)');
    });

    it('should check checkbox when is required and not selected', () => {
      component.fieldList = [
        {
          fieldType: 'boolean',
          label: 'bbb',
          required: true,
        },
      ];

      const { submit } = getSelectors(hostDebug);
      fixture.detectChanges();

      const label = checkboxLabel(0);
      expect(label.nativeElement.innerText).not.toContain('(Optional)');
      expect(submit.nativeElement.disabled).toBeTruthy();
    });
  });

  describe('date field', async () => {
    let dateInput;
    describe('field required', () => {
      beforeEach(() => {
        component.fieldList = [
          {
            fieldType: 'date',
            label: 'date',
            required: true,
          },
        ];
        dateInput = fieldSelector(0, 'input').nativeElement;
      });

      it('submit button should be disabled when date input is empty', () => {
        fixture.detectChanges();
        const { submit } = getSelectors(hostDebug);

        expect(submit.nativeElement.disabled).toBeTruthy();
      });

      it('should check date required validation', () => {
        dateInput.value = '';

        dispatchInputEvent(dateInput);
        fixture.detectChanges();
        const dateError = fieldSelector(0, 'mat-error').nativeElement;

        expect(dateError.textContent).toContain('This field is required');
      });
    });

    describe('field not required', () => {
      beforeEach(() => {
        component.fieldList = [
          {
            fieldType: 'date',
            label: 'date',
            required: false,
          },
        ];
        dateInput = fieldSelector(0, 'input').nativeElement;
      });

      it('should have enabled submit button', () => {
        fixture.detectChanges();
        const { submit } = getSelectors(hostDebug);

        expect(submit.nativeElement.disabled).toBeFalse();
      });
    });

    describe('range validation', () => {
      beforeEach(() => {
        component.fieldList = [
          {
            fieldType: 'date',
            label: 'date',
            maxDate: new Date('2021-06-12T22:00:00.000Z'),
            minDate: new Date('2015-12-31T23:00:00.000Z'),
          },
        ];
        dateInput = fieldSelector(0, 'input').nativeElement;
      });

      it('should check minimum date validation', () => {
        dateInput.value = '1/1/1970';

        dispatchInputEvent(dateInput);
        fixture.detectChanges();

        const dateError = fieldSelector(0, 'mat-error').nativeElement;

        expect(dateError.textContent).toContain('Minimum allowed date is');
      });

      it('should check minimum date validation', () => {
        dateInput.value = '1/1/2200';

        dispatchInputEvent(dateInput);
        fixture.detectChanges();

        const dateError = fieldSelector(0, 'mat-error').nativeElement;

        expect(dateError.textContent).toContain('Maximum allowed date is');
      });
    });
  });

  describe('text field', () => {
    let field;
    beforeEach(() => {
      component.fieldList = [
        {
          fieldType: 'text',
          label: 'label',
          maxLength: 5,
          minLength: 3,
          pattern: null,
          required: true,
        },
      ];
      field = fieldSelector(0, 'input').nativeElement;
    });

    it('should check required error', () => {
      field.value = '';

      dispatchInputEvent(field);
      fixture.detectChanges();

      const error = fieldSelector(0, 'mat-error').nativeElement;

      expect(error.textContent).toContain('This field is required');
    });

    it('should check max length error', () => {
      field.value = '1234567';

      dispatchInputEvent(field);
      fixture.detectChanges();

      const error = fieldSelector(0, 'mat-error').nativeElement;

      expect(error.textContent).toContain('Please input at most 5 characters');
    });

    it('should check max length error', () => {
      field.value = 'a';

      dispatchInputEvent(field);
      fixture.detectChanges();

      const error = fieldSelector(0, 'mat-error').nativeElement;

      expect(error.textContent).toContain('Please input at least 3 characters');
    });
  });

  describe('number field', () => {
    let field;
    beforeEach(() => {
      component.fieldList = [
        {
          fieldType: 'number',
          label: 'label',
          maxValue: 10,
          minValue: 2,
          required: true,
        },
      ];

      field = fieldSelector(0, 'input').nativeElement;
    });

    it('should check required error', () => {
      field.value = '';

      dispatchInputEvent(field);
      fixture.detectChanges();

      const error = fieldSelector(0, 'mat-error').nativeElement;

      expect(error.textContent).toContain('This field is required');
    });

    it('should check maxValue error', () => {
      field.value = '15';

      dispatchInputEvent(field);
      fixture.detectChanges();

      const error = fieldSelector(0, 'mat-error').nativeElement;

      expect(error.textContent).toContain('Max value is 10');
    });
    it('should check maxValue error', () => {
      field.value = '1';

      dispatchInputEvent(field);
      fixture.detectChanges();

      const error = fieldSelector(0, 'mat-error').nativeElement;

      expect(error.textContent).toContain('Min value is 2');
    });
  });

  it('should have enabled submit button when registration types are removed and elements from fieldList are filled', () => {
    component.fieldList = [
      {
        fieldType: FieldTypesEnum.Number,
        label: 'label',
        maxValue: 10,
        minValue: 2,
        required: true,
      },
    ];

    const field = fieldSelector(0, 'input').nativeElement;

    field.value = '3';

    dispatchInputEvent(field);
    fixture.detectChanges();

    const { submit } = getSelectors(hostDebug);
    expect(submit.nativeElement.disabled).toBeFalse();
  });

  it('should use json editor when fieldType is json', () => {
    component.fieldList = [
      {
        fieldType: FieldTypesEnum.Json,
        label: 'label',
        maxValue: 10,
        minValue: 2,
        required: true,
      },
    ];

    const jsonEditor =
      getElementByCss(hostDebug)('app-json-editor')?.nativeElement;
    expect(jsonEditor).toBeTruthy();
  });

  it('should emit stringified json', () => {
    const submitDataSpy = spyOn(component.submitForm, 'emit');
    component.fieldList = [
      {
        fieldType: FieldTypesEnum.Json,
        label: 'label 1',
        required: true,
        schema: { type: 'object' },
      },
      {
        fieldType: FieldTypesEnum.Json,
        label: 'label 2',
        required: true,
        schema: { type: 'object' },
      },
    ];

    fixture.detectChanges();

    component.getControl(0).setValue({ a: 'b' });
    component.getControl(1).setValue({ b: 'c', d: { e: 2 } });

    component.submit();

    expect(submitDataSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        fields: [
          { key: 'label 1', value: JSON.stringify({ a: 'b' }) },
          { key: 'label 2', value: JSON.stringify({ b: 'c', d: { e: 2 } }) },
        ],
      })
    );
  });
});

const getSelectors = (hostDebug: DebugElement) => {
  return {
    submit: hostDebug.query(By.css('[data-qa-id=submit-request]')),
    offChain: hostDebug.query(By.css('[data-qa-id=off-chain] input')),
    onChain: hostDebug.query(By.css('[data-qa-id=on-chain] input')),
    checkboxError: hostDebug.query(
      By.css('[data-qa-id=not-enough-checkbox-checked]')
    ),
  };
};
