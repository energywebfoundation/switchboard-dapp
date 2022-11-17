import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrganizationActionsComponent } from './organization-actions.component';
import { MatDialog } from '@angular/material/dialog';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { actionSelectors } from '../action-test.utils';
import { of } from 'rxjs';
import {
  NewOrganizationComponent,
  ViewType,
} from '../../new-organization/new-organization.component';
import { NewRoleComponent } from '../../new-role/new-role.component';
import { ListType } from '../../../../shared/constants/shared-constants';
import { ConfirmationDialogComponent } from '../../../widgets/confirmation-dialog/confirmation-dialog.component';
import { FeatureToggleMockDirective } from '@tests';

describe('OrganizationActionsComponent', () => {
  let component: OrganizationActionsComponent;
  let fixture: ComponentFixture<OrganizationActionsComponent>;
  let hostDebug: DebugElement;
  const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OrganizationActionsComponent, FeatureToggleMockDirective],
      providers: [{ provide: MatDialog, useValue: dialogSpy }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationActionsComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call ConfirmationDialogComponent with proper information', () => {
    const element = { namespace: '', owner: '' } as any;
    component.organization = element;
    fixture.detectChanges();
    const { editBtn } = actionSelectors(hostDebug);
    spyOn(component.edited, 'emit');

    dialogSpy.open.and.returnValue({ afterClosed: () => of(true) });
    editBtn.click();

    expect(dialogSpy.open).toHaveBeenCalledWith(
      NewOrganizationComponent,
      jasmine.objectContaining({
        data: {
          viewType: ViewType.UPDATE,
          origData: element,
        },
      })
    );
  });

  it('should call NewRoleComponent with proper information', () => {
    const element = { namespace: '', owner: '' } as any;
    component.organization = element;
    fixture.detectChanges();
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
          listType: ListType.ORG,
          owner: element.owner,
        },
      })
    );
  });

  it('should call ConfirmationDialogComponent with proper information', () => {
    component.organization = {} as any;
    fixture.detectChanges();
    const { deleteBtn } = actionSelectors(hostDebug);
    spyOn(component.deleteConfirmed, 'emit');

    dialogSpy.open.and.returnValue({ afterClosed: () => of(true) });
    deleteBtn.click();

    expect(dialogSpy.open).toHaveBeenCalledWith(
      ConfirmationDialogComponent,
      jasmine.objectContaining({
        data: {
          header: 'Remove Organization',
          message: 'Do you wish to continue?',
        },
      })
    );
  });
});
