import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrolmentListFilterComponent } from './enrolment-list-filter.component';

describe('EnrolmentListFilterComponent', () => {
  let component: EnrolmentListFilterComponent;
  let fixture: ComponentFixture<EnrolmentListFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnrolmentListFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrolmentListFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
