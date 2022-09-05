import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RolePreconditionListComponent } from './role-precondition-list.component';
import { RolePreconditionType } from '../models/role-precondition-type.enum';
import { PublishRoleService } from '../../../shared/services/publish-role/publish-role.service';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { getElement } from '@tests';
import { of } from 'rxjs';

describe('RolePreconditionListComponent', () => {
  let component: RolePreconditionListComponent;
  let fixture: ComponentFixture<RolePreconditionListComponent>;
  let publishRoleServiceSpy;
  let hostDebug: DebugElement;
  beforeEach(waitForAsync(() => {
    publishRoleServiceSpy = jasmine.createSpyObj('PublishRoleService', [
      'addToDidDoc',
    ]);
    TestBed.configureTestingModule({
      imports: [MatIconTestingModule],
      declarations: [RolePreconditionListComponent],
      providers: [
        { provide: PublishRoleService, useValue: publishRoleServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolePreconditionListComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
  });

  it('should create', () => {
    fixture.detectChanges();

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

  it('should return empty list when preconditions are not defined', () => {
    fixture.detectChanges();

    expect(component.list).toEqual([]);
  });

  it('should return empty list when preconditions are empty list', () => {
    component.preconditionList = [];

    fixture.detectChanges();

    expect(component.list).toEqual([]);
  });

  it('should return list with one element when there is one precondition and no user roles are not defined', () => {
    component.preconditionList = [
      { conditionNamespace: 'namespace', status: RolePreconditionType.PENDING },
    ];

    fixture.detectChanges();

    expect(component.list).toEqual(component.preconditionList as any);
  });

  it('should merge precondition and user role', () => {
    component.preconditionList = [
      {
        conditionNamespace: 'namespace',
        status: RolePreconditionType.APPROVED,
      },
    ];
    component.userRoles = [{ claimType: 'namespace' } as any];

    fixture.detectChanges();

    expect(component.list).toEqual([
      { ...component.preconditionList[0], ...component.userRoles[0] },
    ]);
  });

  it('should update list after successful publishing', (done) => {
    publishRoleServiceSpy.addToDidDoc.and.returnValue(of(true));
    component.preconditionList = [
      {
        conditionNamespace: 'namespace',
        status: RolePreconditionType.APPROVED,
      },
    ];
    component.userRoles = [
      { claimType: 'namespace', issuedToken: 'token' } as any,
    ];
    fixture.detectChanges();

    const publishButton = getElement(hostDebug)('publish-0')?.nativeElement;

    publishButton.click();
    fixture.detectChanges();

    expect(publishRoleServiceSpy.addToDidDoc).toHaveBeenCalledWith({
      ...component.preconditionList[0],
      ...component.userRoles[0],
      status: RolePreconditionType.APPROVED,
    });

    expect(component.list).toEqual([
      {
        ...component.preconditionList[0],
        ...component.userRoles[0],
        status: RolePreconditionType.SYNCED,
      },
    ]);
    done();
  });
});
