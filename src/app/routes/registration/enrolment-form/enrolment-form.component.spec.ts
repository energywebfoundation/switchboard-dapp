import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrolmentFormComponent } from './enrolment-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';

describe('EnrolmentFormComponent', () => {
  let component: EnrolmentFormComponent;
  let fixture: ComponentFixture<EnrolmentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnrolmentFormComponent ],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCheckboxModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrolmentFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.fieldList = [];
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
