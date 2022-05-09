import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrolmentStatusComponent } from './enrolment-status.component';

describe('EnrolmentStatusComponent', () => {
  let component: EnrolmentStatusComponent;
  let fixture: ComponentFixture<EnrolmentStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnrolmentStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrolmentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
