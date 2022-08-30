import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RoleActionsComponent } from './role-actions.component';
import { MatDialog } from '@angular/material/dialog';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  actionSelectors,
  shouldEmit,
  shouldNotEmit,
} from '../action-test.utils';
import { of } from 'rxjs';
import { ViewType } from '../../new-organization/new-organization.component';
import { NewRoleComponent } from '../../new-role/new-role.component';
import { IRole } from 'iam-client-lib';

describe('RoleActionsComponent', () => {
  let component: RoleActionsComponent;
  let fixture: ComponentFixture<RoleActionsComponent>;
  let hostDebug: DebugElement;
  const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
  const element = { namespace: '', owner: '' };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RoleActionsComponent],
      providers: [{ provide: MatDialog, useValue: dialogSpy }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleActionsComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
    component.role = { ...element } as IRole;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('edited event', () => {
    it('should call ConfirmationDialogComponent with proper information', () => {
      const { editBtn } = actionSelectors(hostDebug);
      spyOn(component.edited, 'emit');

      dialogSpy.open.and.returnValue({ afterClosed: () => of(true) });
      editBtn.click();

      expect(dialogSpy.open).toHaveBeenCalledWith(
        NewRoleComponent,
        jasmine.objectContaining({
          data: {
            viewType: ViewType.UPDATE,
            origData: { ...element },
          },
        })
      );
    });
    it('should emit when dialog returns true', () => {
      const { editBtn } = actionSelectors(hostDebug);
      shouldEmit(editBtn, component, dialogSpy, 'edited');
    });

    it('should not emit when dialog returns false', () => {
      const { editBtn } = actionSelectors(hostDebug);
      shouldNotEmit(editBtn, component, dialogSpy, 'edited');
    });
  });

  describe('enrolmentUrl generation', () => {
    it('should have undefined enrolmentUrl when not passing element', () => {
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.enrolmentUrl).toBeUndefined();
    });

    it('should check when element have proper construction', () => {
      component.role = {
        name: 'role2',
        namespace: 'role2.roles.test.iam.ewc',
        definition: {
          roleType: 'org',
        },
      } as IRole;
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.enrolmentUrl).toContain(
        `/enrol?org=test.iam.ewc&roleName=role2`
      );
    });
  });
});
