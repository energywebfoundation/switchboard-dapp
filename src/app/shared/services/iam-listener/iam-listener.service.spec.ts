import { TestBed } from '@angular/core/testing';

import { IamListenerService } from './iam-listener.service';
import { IamService } from '../iam.service';

describe('IamListenerService', () => {
  let service: IamListenerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: IamService, useValue: {}}
      ]
    });
    service = TestBed.inject(IamListenerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
