import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetEnrolmentListComponent } from './asset-enrolment-list.component';

xdescribe('EnrolmentListComponent', () => {
  let component: AssetEnrolmentListComponent;
  let fixture: ComponentFixture<AssetEnrolmentListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssetEnrolmentListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetEnrolmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
