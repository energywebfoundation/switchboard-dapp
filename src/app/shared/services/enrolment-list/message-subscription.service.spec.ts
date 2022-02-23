import { TestBed } from '@angular/core/testing';

import { MessageSubscriptionService } from './message-subscription.service';

describe('MessageSubscriptionService', () => {
  let service: MessageSubscriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageSubscriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
