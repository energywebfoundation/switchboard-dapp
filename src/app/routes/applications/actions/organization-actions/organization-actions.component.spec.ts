import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrganizationActionsComponent } from './organization-actions.component';
import { MatDialog } from '@angular/material/dialog';
import { DebugElement, Directive, NO_ERRORS_SCHEMA, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { actionSelectors } from '../action-test.utils';
import { of } from 'rxjs';
import { NewOrganizationComponent, ViewType } from '../../new-organization/new-organization.component';
import { NewRoleComponent } from '../../new-role/new-role.component';
import { ListType } from '../../../../shared/constants/shared-constants';
import { ConfirmationDialogComponent } from '../../../widgets/confirmation-dialog/confirmation-dialog.component';

@Directive({
  selector: '[appIsFeatureEnabled]'
})
class FeatureToggleMockDirective implements OnInit {

  private hasView = true;

  constructor(private templateRef: TemplateRef<any>,
              private vcr: ViewContainerRef) {
  }

  ngOnInit() {
    this.vcr.createEmbeddedView(this.templateRef);
    this.hasView = true;
  }

}

describe('OrganizationActionsComponent', () => {
  let component: OrganizationActionsComponent;
  let fixture: ComponentFixture<OrganizationActionsComponent>;
  let hostDebug: DebugElement;
  const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OrganizationActionsComponent, FeatureToggleMockDirective],
      providers: [
        {provide: MatDialog, useValue: dialogSpy}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
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

  describe('stakingUrl', () => {
    it('should check if staking url is undefined when passed element is undefined', () => {
      component.organization = undefined;
      fixture.detectChanges();

      expect(component.stakingUrl).toBeUndefined();
    });

    it('should check if staking url is undefined when passed element without namespace', () => {
      component.organization = {example: ''};
      fixture.detectChanges();

      expect(component.stakingUrl).toBeUndefined();
    });

    it('should generate stakingUrl when passing element with namespace', () => {
      component.organization = {namespace: 'test'};
      fixture.detectChanges();

      expect(component.stakingUrl).toContain('/staking?org=test');
    });
  });

  describe('isProvider', () => {
    it('should check when an organization is a provider', () => {
      component.organization = {
        isProvider: true
      };
      fixture.detectChanges();
      const {createStakingPoolBtn, copyStakingUrlBtn} = actionSelectors(hostDebug);

      expect(createStakingPoolBtn).toBeUndefined();
      expect(copyStakingUrlBtn).toBeTruthy();
    });

    it('should check when an organization is not a provider', () => {
      component.organization = {
        isProvider: false
      };
      fixture.detectChanges();
      const {createStakingPoolBtn, copyStakingUrlBtn} = actionSelectors(hostDebug);

      expect(createStakingPoolBtn).toBeTruthy();
      expect(copyStakingUrlBtn).toBeUndefined();
    });
  });

  it('should call ConfirmationDialogComponent with proper information', () => {
    const element = {namespace: '', owner: ''};
    component.organization = element;
    fixture.detectChanges();
    const {editBtn} = actionSelectors(hostDebug);
    spyOn(component.edited, 'emit');

    dialogSpy.open.and.returnValue({afterClosed: () => of(true)});
    editBtn.click();

    expect(dialogSpy.open).toHaveBeenCalledWith(NewOrganizationComponent, jasmine.objectContaining({
      data: {
        viewType: ViewType.UPDATE,
        origData: element
      }
    }));
  });

  it('should call NewRoleComponent with proper information', () => {
    const element = {namespace: '', owner: ''};
    component.organization = element;
    fixture.detectChanges();
    const {createRoleBtn} = actionSelectors(hostDebug);
    spyOn(component.roleCreated, 'emit');

    dialogSpy.open.and.returnValue({afterClosed: () => of(true)});
    createRoleBtn.click();

    expect(dialogSpy.open).toHaveBeenCalledWith(NewRoleComponent, jasmine.objectContaining({
      data: {
        viewType: ViewType.NEW,
        namespace: element.namespace,
        listType: ListType.ORG,
        owner: element.owner
      }
    }));
  });

  it('should call ConfirmationDialogComponent with proper information', () => {
    component.organization = {};
    fixture.detectChanges();
    const {deleteBtn} = actionSelectors(hostDebug);
    spyOn(component.deleteConfirmed, 'emit');

    dialogSpy.open.and.returnValue({afterClosed: () => of(true)});
    deleteBtn.click();

    expect(dialogSpy.open).toHaveBeenCalledWith(ConfirmationDialogComponent, jasmine.objectContaining({
      data: {
        header: 'Remove Organization',
        message: 'Do you wish to continue?'
      }
    }));
  });
});
