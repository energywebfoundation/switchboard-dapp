import { TestBed } from '@angular/core/testing';

import { IamListenerService } from './iam-listener.service';
import { IamService } from '../iam.service';

describe('IamListenerService', () => {
  let service: IamListenerService;
  const iamSpy = jasmine.createSpyObj('iam', ['on']);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: IamService, useValue: {iam: iamSpy}}
      ]
    });
    service = TestBed.inject(IamListenerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call 3 events', () => {
    service.setListeners(() => {});
    expect(iamSpy.on).toHaveBeenCalledTimes(3);
  });
});
