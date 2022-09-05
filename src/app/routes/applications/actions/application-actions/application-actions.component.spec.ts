import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ApplicationActionsComponent } from './application-actions.component';
import { MatDialog } from '@angular/material/dialog';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { NewApplicationComponent } from '../../new-application/new-application.component';
import { ViewType } from '../../new-organization/new-organization.component';
import { ConfirmationDialogComponent } from '../../../widgets/confirmation-dialog/confirmation-dialog.component';
import { NewRoleComponent } from '../../new-role/new-role.component';
import { ListType } from '../../../../shared/constants/shared-constants';
import {
  actionSelectors,
  shouldEmit,
  shouldNotEmit,
} from '../action-test.utils';

describe('ApplicationActionsComponent', () => {
  let component: ApplicationActionsComponent;
  let fixture: ComponentFixture<ApplicationActionsComponent>;
  let hostDebug: DebugElement;
  let dialogSpy;
  const element = {
    namespace: 'namespace.iam.ewc',
    owner: '',
    containsRoles: true,
  };
  beforeEach(waitForAsync(() => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    TestBed.configureTestingModule({
      declarations: [ApplicationActionsComponent],
      providers: [{ provide: MatDialog, useValue: dialogSpy }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationActionsComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
    component.application = { ...element };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit viewRoles event when clicking on button', () => {
    const { viewBtn } = actionSelectors(hostDebug);
    spyOn(component.viewRoles, 'emit');

    viewBtn.click();

    expect(component.viewRoles.emit).toHaveBeenCalled();
  });

  describe('edited event', () => {
    it('should call NewApplicationComponent with proper information', () => {
      const { editBtn } = actionSelectors(hostDebug);
      spyOn(component.edited, 'emit');

      dialogSpy.open.and.returnValue({ afterClosed: () => of(true) });
      editBtn.click();

      expect(dialogSpy.open).toHaveBeenCalledWith(
        NewApplicationComponent,
        jasmine.objectContaining({
          data: {
            viewType: ViewType.UPDATE,
            ...element,
            orgNamespace: element.namespace,
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

  describe('deleteConfirmed', () => {
    it('should call ConfirmationDialogComponent with proper information', () => {
      const { deleteBtn } = actionSelectors(hostDebug);
      spyOn(component.deleteConfirmed, 'emit');

      dialogSpy.open.and.returnValue({ afterClosed: () => of(true) });
      deleteBtn.click();

      expect(dialogSpy.open).toHaveBeenCalledWith(
        ConfirmationDialogComponent,
        jasmine.objectContaining({
          data: {
            header: 'Remove Application',
            message: 'Do you wish to continue?',
          },
        })
      );
    });

    it('should emit event when dialog returns true', () => {
      const { deleteBtn } = actionSelectors(hostDebug);
      shouldEmit(deleteBtn, component, dialogSpy, 'deleteConfirmed');
    });

    it('should not emit event when dialog returns false', () => {
      const { deleteBtn } = actionSelectors(hostDebug);
      shouldNotEmit(deleteBtn, component, dialogSpy, 'deleteConfirmed');
    });
  });

  describe('roleCreated', () => {
    it('should call NewRoleComponent with proper information', () => {
      const { createRoleBtn } = actionSelectors(hostDebug);
      spyOn(component.roleCreated, 'emit');

      dialogSpy.open.and.returnValue({ afterClosed: () => of(true) });
      createRoleBtn.click();

      expect(dialogSpy.open).toHaveBeenCalledWith(
        NewRoleComponent,
        jasmine.objectContaining({
          data: {
            viewType: ViewType.NEW,
            namespace: element.namespace,
            listType: ListType.APP,
            owner: element.owner,
          },
        })
      );
    });

    it('should emit event when dialog returns true', () => {
      const { createRoleBtn } = actionSelectors(hostDebug);
      shouldEmit(createRoleBtn, component, dialogSpy, 'roleCreated');
    });

    it('should not emit event when dialog returns false', () => {
      const { createRoleBtn } = actionSelectors(hostDebug);
      shouldNotEmit(createRoleBtn, component, dialogSpy, 'roleCreated');
    });
  });
});
