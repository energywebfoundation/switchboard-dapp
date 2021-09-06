import { TestBed } from '@angular/core/testing';

import { ReplaySubject } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { IamService } from '../../shared/services/iam.service';
import { OrganizationEffects } from './organization.effects';

describe('AssetDetailsEffects', () => {

  const iamServiceSpy = jasmine.createSpyObj('IamService', ['']);
  let actions$: ReplaySubject<any>;
  let effects: OrganizationEffects;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OrganizationEffects,
        {provide: IamService, useValue: iamServiceSpy},
        provideMockStore(),
        provideMockActions(() => actions$),
      ],
    });
    store = TestBed.inject(MockStore);

    effects = TestBed.inject(OrganizationEffects);
  });


});
