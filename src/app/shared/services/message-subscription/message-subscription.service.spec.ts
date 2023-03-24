import { TestBed } from '@angular/core/testing';

import { MessageSubscriptionService } from './message-subscription.service';
import { IamService } from '../iam.service';
import { SwitchboardToastrService } from '../switchboard-toastr.service';
import { NotificationService } from '../notification.service';
import { provideMockStore } from '@ngrx/store/testing';

describe('MessageSubscriptionService', () => {
  let service: MessageSubscriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: IamService,
          useValue: {
            messagingService: { unsubscribeFrom: (id: number) => {} },
          },
        },
        { provide: SwitchboardToastrService, useValue: {} },
        { provide: NotificationService, useValue: {} },
        provideMockStore(),
      ],
    });
    service = TestBed.inject(MessageSubscriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
