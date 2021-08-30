import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssetEnrolmentListComponent } from './asset-enrolment-list.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

xdescribe('AssetEnrolmentListComponent', () => {
  let component: AssetEnrolmentListComponent;
  let fixture: ComponentFixture<AssetEnrolmentListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AssetEnrolmentListComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetEnrolmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
