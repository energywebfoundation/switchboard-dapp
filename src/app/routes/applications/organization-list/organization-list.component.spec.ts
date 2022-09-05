import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrganizationListComponent } from './organization-list.component';
import { MatDialog } from '@angular/material/dialog';
import { LoadingService } from '../../../shared/services/loading.service';
import { IamService } from '../../../shared/services/iam.service';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { OrganizationActions, OrganizationSelectors } from '@state';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EnvService } from '../../../shared/services/env/env.service';

describe('OrganizationListComponent', () => {
  let component: OrganizationListComponent;
  let fixture: ComponentFixture<OrganizationListComponent>;
  let store: MockStore;
  let dispatchSpy;

  const setUp = (list = [], hierarchy = []) => {
    store.overrideSelector(OrganizationSelectors.getHierarchy, hierarchy);
    store.overrideSelector(OrganizationSelectors.getList, list);
    fixture.detectChanges();
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OrganizationListComponent],
      providers: [
        { provide: MatDialog, useValue: {} },
        { provide: LoadingService, useValue: {} },
        { provide: IamService, useValue: {} },
        { provide: SwitchboardToastrService, useValue: {} },
        { provide: EnvService, useValue: { rootNamespace: 'iam.ewc' } },
        provideMockStore(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    dispatchSpy = spyOn(store, 'dispatch');
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    setUp();
    expect(component).toBeTruthy();
  });

  it('should set list to table datasource', () => {
    setUp([{}]);
    expect(dispatchSpy).toHaveBeenCalledWith(OrganizationActions.getList());

    expect(component.dataSource.data.length).toBe(1);
  });

  describe('getTooltip method', () => {
    it('should check when element do not have sub orgs', () => {
      setUp();

      expect(component.getTooltip({})).toBe('');
    });

    it('should check if element contains one sub org ', () => {
      setUp();

      expect(
        component.getTooltip({ subOrgs: [{ namespace: 'foo' }] })
      ).toContain('Sub-Organization \n\nfoo');
    });

    it('should check if element contains 6 sub org', () => {
      setUp();

      expect(
        component.getTooltip({
          subOrgs: [
            { namespace: 'foo1' },
            { namespace: 'foo2' },
            { namespace: 'foo3' },
            { namespace: 'foo4' },
            { namespace: 'foo5' },
            { namespace: 'foo6' },
          ],
        })
      ).toContain(
        'Sub-Organizations \n\nfoo1\nfoo2\nfoo3\nfoo4\nfoo5\n\n ... +1 More'
      );
    });
  });

  it('should dispatch action for creating sub organization', () => {
    setUp();
    const org = { namespace: 'foo' } as any;
    component.newSubOrg(org);
    expect(dispatchSpy).toHaveBeenCalledWith(
      OrganizationActions.createSub({ org })
    );
  });

  it('should dispatch action for updating selected organization after edit', () => {
    component.edit();
    expect(dispatchSpy).toHaveBeenCalledWith(
      OrganizationActions.updateSelectedOrgAfterEdit()
    );
  });

  it('should dispatch action for updating selected organization after transferring organization', () => {
    component.transferOwnership();
    expect(dispatchSpy).toHaveBeenCalledWith(
      OrganizationActions.updateSelectedOrgAfterTransfer()
    );
  });
});
