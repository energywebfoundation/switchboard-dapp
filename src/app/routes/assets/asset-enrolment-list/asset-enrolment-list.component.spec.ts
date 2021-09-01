import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssetEnrolmentListComponent } from './asset-enrolment-list.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { UrlService } from '../../../shared/services/url-service/url.service';
import { AssetDetailsActions, AssetDetailsSelectors } from '@state';
import { RouterTestingModule } from '@angular/router/testing';

export class MockActivatedRoute {
  private innerTestParams?: any;
  private subject?: BehaviorSubject<any> = new BehaviorSubject(this.testParams);

  params = this.subject.asObservable();
  queryParams = this.subject.asObservable();

  constructor(params?: Params) {
    if (params) {
      this.testParams = params;
    } else {
      this.testParams = {};
    }
  }

  get testParams() {
    return this.innerTestParams;
  }

  set testParams(params: {}) {
    this.innerTestParams = params;
    this.subject.next(params);
  }

  get snapshot() {
    return {params: this.testParams, queryParams: this.testParams};
  }
}

describe('AssetEnrolmentListComponent', () => {
  let component: AssetEnrolmentListComponent;
  let fixture: ComponentFixture<AssetEnrolmentListComponent>;
  let activatedRouteStub;
  let store: MockStore;

  beforeEach(waitForAsync(() => {
    activatedRouteStub = new MockActivatedRoute();
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([])
      ],
      declarations: [AssetEnrolmentListComponent],
      providers: [
        {provide: ActivatedRoute, useValue: activatedRouteStub},
        {provide: UrlService, useValue: {}},
        provideMockStore()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetEnrolmentListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    store.overrideSelector(AssetDetailsSelectors.getAssetDetails, {});
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should set subject and dispatch action for getting asset information', waitForAsync(() => {
    store.overrideSelector(AssetDetailsSelectors.getAssetDetails, {});
    activatedRouteStub.testParams = {subject: '123'};
    const dispatchSpy = spyOn(store, 'dispatch');

    fixture.detectChanges();

    expect(component.subject).toBe('123');
    expect(dispatchSpy).toHaveBeenCalledWith(AssetDetailsActions.getDetails({assetId: '123'}));
  }));

  it('should not set subject and do not dispatch action when getting wrong params', () => {
    store.overrideSelector(AssetDetailsSelectors.getAssetDetails, {});
    activatedRouteStub.testParams = {notSubject: '123'};
    const dispatchSpy = spyOn(store, 'dispatch');

    fixture.detectChanges();

    expect(component.subject).toBeUndefined();
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should get only first subject from params', () => {
    store.overrideSelector(AssetDetailsSelectors.getAssetDetails, {});
    activatedRouteStub.testParams = {subject: '123'};
    const dispatchSpy = spyOn(store, 'dispatch');

    fixture.detectChanges();

    activatedRouteStub.testParams = {subject: '1'};
    fixture.detectChanges();

    expect(component.subject).toBe('123');
    expect(dispatchSpy).toHaveBeenCalledWith(AssetDetailsActions.getDetails({assetId: '123'}));
  });


});
