import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrolmentFormComponent } from './enrolment-form.component';

describe('EnrolmentFormComponent', () => {
  let component: EnrolmentFormComponent;
  let fixture: ComponentFixture<EnrolmentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnrolmentFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrolmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
