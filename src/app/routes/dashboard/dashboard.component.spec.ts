import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockActivatedRoute } from '@tests';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LayoutActions, SettingsSelectors } from '@state';
import * as userSelectors from '../../state/user-claim/user.selectors';
import * as AuthActions from '../../state/auth/auth.actions';
import { SearchType } from 'iam-client-lib';
import { RouterConst } from '../router-const';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let activatedRouteStub: MockActivatedRoute;
  let store: MockStore;
  let dispatchSpy;
  const routerSpy = jasmine.createSpyObj('Router', [
    'navigateByUrl',
    'navigate',
  ]);
  const setUp = () => {
    store.overrideSelector(userSelectors.getUserName, 'Name');
    store.overrideSelector(userSelectors.getDid, 'did');
    store.overrideSelector(SettingsSelectors.isExperimentalEnabled, true);
  };
  beforeEach(waitForAsync(() => {
    activatedRouteStub = new MockActivatedRoute();
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      declarations: [DashboardComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useValue: routerSpy },
        provideMockStore(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    dispatchSpy = spyOn(store, 'dispatch');
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    setUp();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call setRedirectUrl action', () => {
    activatedRouteStub.testParams = { returnUrl: RouterConst.Dashboard };
    setUp();
    fixture.detectChanges();
    expect(dispatchSpy).toHaveBeenCalledWith(
      LayoutActions.setRedirectUrl({ url: RouterConst.Dashboard })
    );
  });

  it('should check if searching through apps and orgs', () => {
    expect(component.searchBy().length).toEqual(2);
    expect(component.searchBy()).toEqual([SearchType.App, SearchType.Org]);
  });

  it('should check if navigates to search-result page', () => {
    const namespace = 'namespace';
    const keyword = 'keyword';
    component.goToSearchResult(namespace, keyword);

    expect(routerSpy.navigate).toHaveBeenCalledWith(
      [RouterConst.SearchResult],
      {
        queryParams: { namespace, keyword },
      }
    );
  });
});
