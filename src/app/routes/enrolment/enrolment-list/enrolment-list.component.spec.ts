import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrolmentListComponent } from './enrolment-list.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('EnrolmentListComponent', () => {
  let component: EnrolmentListComponent;
  let fixture: ComponentFixture<EnrolmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnrolmentListComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrolmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
