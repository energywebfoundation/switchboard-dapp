import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ApplicationListComponent } from './application-list.component';
import { MatDialog } from '@angular/material/dialog';
import { dialogSpy, iamServiceSpy, loadingServiceSpy, toastrSpy } from '@tests';
import { LoadingService } from '../../../shared/services/loading.service';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { IamService } from '../../../shared/services/iam.service';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ApplicationSelectors } from '@state';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ENSNamespaceTypes } from 'iam-client-lib';
import { ListType } from '../../../shared/constants/shared-constants';

describe('ApplicationListComponent', () => {
  let component: ApplicationListComponent;
  let fixture: ComponentFixture<ApplicationListComponent>;
  let store: MockStore;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicationListComponent],
      imports: [ReactiveFormsModule],
      providers: [
        {provide: MatDialog, useValue: dialogSpy},
        {provide: LoadingService, useValue: loadingServiceSpy},
        {provide: SwitchboardToastrService, useValue: toastrSpy},
        {provide: IamService, useValue: iamServiceSpy},
        provideMockStore()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationListComponent);
    component = fixture.componentInstance;
    store.overrideSelector(ApplicationSelectors.getFilteredList, []);
    store.overrideSelector(ApplicationSelectors.getFilters, {organization: '', application: '', role: ''});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('tests for viewRoles method', () => {
    it('should emit event with not nested organization and application ', () => {
      const eventSpy = spyOn(component.updateFilter, 'emit');
      component.viewRoles({namespace: `testapp.${ENSNamespaceTypes.Application}.test.iam.ewc`});

      expect(eventSpy).toHaveBeenCalledWith({
        listType: ListType.ROLE,
        organization: 'test',
        application: 'testapp'
      });
    });

    it('should emit event with nested organization and application', () => {
      const eventSpy = spyOn(component.updateFilter, 'emit');
      component.viewRoles({namespace: `testapp.${ENSNamespaceTypes.Application}.suborg.test.iam.ewc`});

      expect(eventSpy).toHaveBeenCalledWith({
        listType: ListType.ROLE,
        organization: 'suborg.test',
        application: 'testapp'
      });
    });

  });
});
