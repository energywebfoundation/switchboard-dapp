import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssetDetailsComponent } from './asset-details.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { UrlService } from '../../../shared/services/url-service/url.service';
import { AssetDetailsActions, AssetDetailsSelectors } from '@state';
import { RouterTestingModule } from '@angular/router/testing';
import { MockActivatedRoute } from '@tests';

describe('AssetEnrolmentListComponent', () => {
  let component: AssetDetailsComponent;
  let fixture: ComponentFixture<AssetDetailsComponent>;
  let activatedRouteStub;
  let store: MockStore;

  beforeEach(waitForAsync(() => {
    activatedRouteStub = new MockActivatedRoute();
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      declarations: [AssetDetailsComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: UrlService, useValue: {} },
        provideMockStore(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    store.overrideSelector(AssetDetailsSelectors.getAssetDetails, {});
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should set subject and dispatch action for getting asset information', waitForAsync(() => {
    store.overrideSelector(AssetDetailsSelectors.getAssetDetails, {});
    activatedRouteStub.testParams = { subject: '123' };
    const dispatchSpy = spyOn(store, 'dispatch');

    fixture.detectChanges();

    expect(component.subject).toBe('123');
    expect(dispatchSpy).toHaveBeenCalledWith(
      AssetDetailsActions.getDetails({ assetId: '123' })
    );
  }));

  it('should not set subject and do not dispatch action when getting wrong params', () => {
    store.overrideSelector(AssetDetailsSelectors.getAssetDetails, {});
    activatedRouteStub.testParams = { notSubject: '123' };
    const dispatchSpy = spyOn(store, 'dispatch');

    fixture.detectChanges();

    expect(component.subject).toBeUndefined();
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should get only first subject from params', () => {
    store.overrideSelector(AssetDetailsSelectors.getAssetDetails, {});
    activatedRouteStub.testParams = { subject: '123' };
    const dispatchSpy = spyOn(store, 'dispatch');

    fixture.detectChanges();

    activatedRouteStub.testParams = { subject: '1' };
    fixture.detectChanges();

    expect(component.subject).toBe('123');
    expect(dispatchSpy).toHaveBeenCalledWith(
      AssetDetailsActions.getDetails({ assetId: '123' })
    );
  });
});
