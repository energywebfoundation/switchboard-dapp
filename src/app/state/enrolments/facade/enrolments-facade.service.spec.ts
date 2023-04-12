import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { EnrolmentsFacadeService } from '@state';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import * as RevocableEnrolmentsActions from '../revokable/revokable.actions';
import * as RevocableEnrolmentsSelectors from '../revokable/revokable.selectors';

describe('EnrolmentsFacadeService', () => {
  let service: EnrolmentsFacadeService;
  let store: MockStore;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EnrolmentsFacadeService, provideMockStore()],
    });
    service = TestBed.inject(EnrolmentsFacadeService);
    store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update only once', fakeAsync(() => {
    const dispatchSpy = spyOn(store, 'dispatch');
    service.update('1');
    service.update('1');
    tick(1000);

    expect(dispatchSpy).toHaveBeenCalledTimes(2);
  }));

  it('should dispatch action for getting list when list is empty', (done) => {
    const dispatchSpy = spyOn(store, 'dispatch');
    store.overrideSelector(RevocableEnrolmentsSelectors.getAllEnrolments, []);
    service.revokableList$.subscribe({
      next: () => {
        expect(dispatchSpy).toHaveBeenCalledOnceWith(
          RevocableEnrolmentsActions.getRevocableEnrolments()
        );
        done();
      },
    });
  });

  it('should not dispatch action when there is not an empty list', (done) => {
    const dispatchSpy = spyOn(store, 'dispatch');
    store.overrideSelector(RevocableEnrolmentsSelectors.getAllEnrolments, [
      {} as any,
    ]);
    service.revokableList$.subscribe({
      next: () => {
        expect(dispatchSpy).not.toHaveBeenCalledOnceWith(
          RevocableEnrolmentsActions.getRevocableEnrolments()
        );
        done();
      },
    });
  });
});
