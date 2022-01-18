import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RolePreconditionListComponent } from './role-precondition-list.component';
import { RolePreconditionType } from '../models/role-precondition-type.enum';

describe('RolePreconditionListComponent', () => {
  let component: RolePreconditionListComponent;
  let fixture: ComponentFixture<RolePreconditionListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RolePreconditionListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolePreconditionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if is pending returns true when passing pending status', () => {
    expect(component.isPending(RolePreconditionType.PENDING)).toBeTrue();
  });

  it('should check if is pending returns false when passing approved status', () => {
    expect(component.isPending(RolePreconditionType.APPROVED)).toBeFalse();
  });

  it('should check if is approved returns true when passing approved status', () => {
    expect(component.isApproved(RolePreconditionType.APPROVED)).toBeTrue();
  });

  it('should check if is aproved returns false when passing pending status', () => {
    expect(component.isApproved(RolePreconditionType.PENDING)).toBeFalse();
  });
});
