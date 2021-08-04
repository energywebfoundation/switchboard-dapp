import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ApplicationActionsComponent } from './application-actions.component';
import { MatDialog } from '@angular/material/dialog';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { NewApplicationComponent } from '../../new-application/new-application.component';
import { ViewType } from '../../new-organization/new-organization.component';
import { ConfirmationDialogComponent } from '../../../widgets/confirmation-dialog/confirmation-dialog.component';
import { NewRoleComponent } from '../../new-role/new-role.component';
import { ListType } from '../../../../shared/constants/shared-constants';

describe('ApplicationActionsComponent', () => {
  let component: ApplicationActionsComponent;
  let fixture: ComponentFixture<ApplicationActionsComponent>;
  let hostDebug: DebugElement;
  const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
  const element = {namespace: '', owner: ''};
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicationActionsComponent],
      providers: [
        {provide: MatDialog, useValue: dialogSpy}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationActionsComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
    component.element = {...element};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit viewRoles event when clicking on button', () => {
    const {viewBtn} = selectors(hostDebug);
    spyOn(component.viewRoles, 'emit');

    viewBtn.click();

    expect(component.viewRoles.emit).toHaveBeenCalled();
  });

  describe('edited event', () => {
    it('should call ConfirmationDialogComponent with proper information', () => {
      const {editBtn} = selectors(hostDebug);
      spyOn(component.edited, 'emit');

      dialogSpy.open.and.returnValue({afterClosed: () => of(true)});
      editBtn.click();

      expect(dialogSpy.open).toHaveBeenCalledWith(NewApplicationComponent, jasmine.objectContaining({
        data: {
          viewType: ViewType.UPDATE,
          origData: element
        }
      }));
    });
    it('should emit when dialog returns true', () => {
      const {editBtn} = selectors(hostDebug);
      shouldEmit(editBtn, component, dialogSpy, 'edited');
    });

    it('should not emit when dialog returns false', () => {
      const {editBtn} = selectors(hostDebug);
      shouldNotEmit(editBtn, component, dialogSpy, 'edited');
    });

  });

  describe('deleteConfirmed', () => {
    it('should call ConfirmationDialogComponent with proper information', () => {
      const {deleteBtn} = selectors(hostDebug);
      spyOn(component.deleteConfirmed, 'emit');

      dialogSpy.open.and.returnValue({afterClosed: () => of(true)});
      deleteBtn.click();

      expect(dialogSpy.open).toHaveBeenCalledWith(ConfirmationDialogComponent, jasmine.objectContaining({
        data: {
          header: 'Remove Application',
          message: 'Do you wish to continue?'
        }
      }));
    });

    it('should emit event when dialog returns true', () => {
      const {deleteBtn} = selectors(hostDebug);
      shouldEmit(deleteBtn, component, dialogSpy, 'deleteConfirmed');
    });

    it('should not emit event when dialog returns false', () => {
      const {deleteBtn} = selectors(hostDebug);
      shouldNotEmit(deleteBtn, component, dialogSpy, 'deleteConfirmed');
    });

  });

  describe('roleCreated', () => {
    it('should call ConfirmationDialogComponent with proper information', () => {
      const {createRoleBtn} = selectors(hostDebug);
      spyOn(component.roleCreated, 'emit');

      dialogSpy.open.and.returnValue({afterClosed: () => of(true)});
      createRoleBtn.click();

      expect(dialogSpy.open).toHaveBeenCalledWith(NewRoleComponent, jasmine.objectContaining({
        data: {
          viewType: ViewType.NEW,
          namespace: element.namespace,
          listType: ListType.APP,
          owner: element.owner
        }
      }));
    });

    it('should emit event when dialog returns true', () => {
      const {createRoleBtn} = selectors(hostDebug);
      shouldEmit(createRoleBtn, component, dialogSpy, 'roleCreated');
    });

    it('should not emit event when dialog returns false', () => {
      const {createRoleBtn} = selectors(hostDebug);
      shouldNotEmit(createRoleBtn, component, dialogSpy, 'roleCreated');
    });

  });

});

const shouldEmit = (button, component, dialogSpy, prop) => {
  spyOn(component[prop], 'emit');

  dialogSpy.open.and.returnValue({afterClosed: () => of(true)});
  button.click();

  expect(component[prop].emit).toHaveBeenCalled();
}
const shouldNotEmit = (button, component, dialogSpy, prop) => {
  spyOn(component[prop], 'emit');

  dialogSpy.open.and.returnValue({afterClosed: () => of(false)});
  button.click();

  expect(component[prop].emit).not.toHaveBeenCalled();
}
const selectors = (hostDebug: DebugElement) => {
  const getElement = (id, postSelector = '') => hostDebug.query(By.css(`[data-qa-id=${id}] ${postSelector}`));

  return {
    viewBtn: getElement('view-roles').nativeElement,
    createRoleBtn: getElement('create-role').nativeElement,
    editBtn: getElement('edit').nativeElement,
    deleteBtn: getElement('delete').nativeElement,
    getElement
  };
};
