import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyEnrolmentListComponent } from './my-enrolment-list.component';

xdescribe('MyEnrolmentListComponent', () => {
  let component: MyEnrolmentListComponent;
  let fixture: ComponentFixture<MyEnrolmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyEnrolmentListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyEnrolmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
