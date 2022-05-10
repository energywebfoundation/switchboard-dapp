import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestedEnrolmentListComponent } from './requested-enrolment-list.component';

xdescribe('RequestedEnrolmentListComponent', () => {
  let component: RequestedEnrolmentListComponent;
  let fixture: ComponentFixture<RequestedEnrolmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestedEnrolmentListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestedEnrolmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
