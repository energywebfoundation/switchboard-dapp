import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrolmentListComponent } from './enrolment-list.component';

xdescribe('EnrolmentListComponent', () => {
  let component: EnrolmentListComponent;
  let fixture: ComponentFixture<EnrolmentListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnrolmentListComponent]
    })
      .compileComponents();
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
