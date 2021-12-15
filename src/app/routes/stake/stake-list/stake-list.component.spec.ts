import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StakeListComponent } from './stake-list.component';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import * as stakeSelectors from '../../../state/stake/stake.selectors';
import { Provider } from '../../../state/stake/models/provider.interface';
import { By } from '@angular/platform-browser';

describe('StakeListComponent', () => {
  let component: StakeListComponent;
  let fixture: ComponentFixture<StakeListComponent>;
  let store: MockStore;
  let hostDebug: DebugElement;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [StakeListComponent],
      providers: [
        {provide: Router, useValue: {}},
        provideMockStore()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StakeListComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
  });

  it('should create', () => {
    fixture.detectChanges();
    store.overrideSelector(stakeSelectors.getProviders, []);
    expect(component).toBeTruthy();
  });

  it('should open new tab when clicking on provider tab', () => {
    spyOn(window, 'open')
    store.overrideSelector(stakeSelectors.getProviders, [{org: 'org'} as Provider]);

    fixture.detectChanges();
    const card = hostDebug.query(By.css('[data-qa-id=provider-org'));
    card.nativeElement.click();

    expect(window.open).toHaveBeenCalledWith('/staking?org=org');
  });
});
