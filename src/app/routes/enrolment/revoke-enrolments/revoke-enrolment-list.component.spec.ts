import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRevokablesListComponent } from './revoke-enrolment-list.component';

xdescribe('RevokableEnrolmentListComponent', () => {
  let component: MyRevokablesListComponent;
  let fixture: ComponentFixture<MyRevokablesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyRevokablesListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyRevokablesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
