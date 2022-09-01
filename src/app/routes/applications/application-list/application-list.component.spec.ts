import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ApplicationListComponent } from './application-list.component';
import { MatDialog } from '@angular/material/dialog';
import { dialogSpy, iamServiceSpy, loadingServiceSpy, toastrSpy } from '@tests';
import { LoadingService } from '../../../shared/services/loading.service';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { IamService } from '../../../shared/services/iam.service';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ApplicationActions, ApplicationSelectors } from '@state';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NamespaceType } from 'iam-client-lib';
import { ListType } from '../../../shared/constants/shared-constants';
import { EnvService } from '../../../shared/services/env/env.service';

describe('ApplicationListComponent', () => {
  let component: ApplicationListComponent;
  let fixture: ComponentFixture<ApplicationListComponent>;
  let store: MockStore;
  const setup = () => {
    store.overrideSelector(ApplicationSelectors.getList, []);
    fixture.detectChanges();
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicationListComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: SwitchboardToastrService, useValue: toastrSpy },
        { provide: IamService, useValue: iamServiceSpy },
        provideMockStore(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
  });

  describe('tests for viewRoles method', () => {
    it('should emit event with not nested organization and application ', () => {
      const eventSpy = spyOn(component.updateFilter, 'emit');
      setup();
      component.viewRoles({
        namespace: `testapp.${NamespaceType.Application}.test.iam.ewc`,
      });

      expect(eventSpy).toHaveBeenCalledWith({
        listType: ListType.ROLE,
        organization: 'test.iam.ewc',
        application: 'testapp',
      });
    });

    it('should emit event with nested organization and application', () => {
      const eventSpy = spyOn(component.updateFilter, 'emit');
      setup();
      component.viewRoles({
        namespace: `testapp.${NamespaceType.Application}.suborg.test.iam.ewc`,
      });

      expect(eventSpy).toHaveBeenCalledWith({
        listType: ListType.ROLE,
        organization: 'suborg.test.iam.ewc',
        application: 'testapp',
      });
    });
  });

  it('should refresh list after successful edition', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    setup();
    component.edit();

    expect(dispatchSpy).toHaveBeenCalledWith(ApplicationActions.getList());
  });
});
