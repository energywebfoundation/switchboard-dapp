import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ArbitraryListComponent } from './arbitrary-list.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ArbitraryActions, ArbitrarySelectors } from '@state';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ArbitraryListComponent', () => {
  let component: ArbitraryListComponent;
  let fixture: ComponentFixture<ArbitraryListComponent>;
  let store: MockStore;
  let dispatchSpy;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ArbitraryListComponent],
      providers: [
        provideMockStore()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArbitraryListComponent);
    component = fixture.componentInstance;
    dispatchSpy = spyOn(store, 'dispatch');
  });

  it('should create', () => {
    store.overrideSelector(ArbitrarySelectors.getList, []);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should dispatch action for getting list or arbitrary vc', () => {
    store.overrideSelector(ArbitrarySelectors.getList, []);
    fixture.detectChanges();
    expect(dispatchSpy).toHaveBeenCalledWith(ArbitraryActions.getList());
  });

  it('should set data to data table', () => {
    store.overrideSelector(ArbitrarySelectors.getList, [{}, {}]);
    fixture.detectChanges();
    expect(component.dataSource.data.length).toEqual(2);
  });
});
