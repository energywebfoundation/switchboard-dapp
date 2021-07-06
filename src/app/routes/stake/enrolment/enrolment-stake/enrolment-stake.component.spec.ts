import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrolmentStakeComponent } from './enrolment-stake.component';

describe('EnrolmentStakeComponent', () => {
  let component: EnrolmentStakeComponent;
  let fixture: ComponentFixture<EnrolmentStakeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnrolmentStakeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrolmentStakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
