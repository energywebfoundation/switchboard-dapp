import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrolmentListComponent } from './enrolment-list.component';

describe('EnrolmentList2Component', () => {
  let component: EnrolmentListComponent;
  let fixture: ComponentFixture<EnrolmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnrolmentListComponent],
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
