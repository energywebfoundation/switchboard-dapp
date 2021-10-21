import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FieldFormComponent } from './field-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FieldValidationService } from '../../../../../shared/services/field-validation.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getElement } from '@tests';

describe('FieldFormComponent', () => {
  let component: FieldFormComponent;
  let fixture: ComponentFixture<FieldFormComponent>;
  const fieldValidationService = jasmine.createSpyObj('FieldFormComponent', ['numberRangeValid', 'autoRangeControls']);
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FieldFormComponent],
      imports: [
        ReactiveFormsModule,
        MatSelectModule,
        NoopAnimationsModule,
        MatInputModule
      ],
      providers: [
        {provide: FieldValidationService, useValue: fieldValidationService}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

const getSelectors = (hostDebug) => {
  return {
    fieldLabel: getElement(hostDebug)('field-label'),
    fieldType: getElement(hostDebug)('field-type'),
  };
};
