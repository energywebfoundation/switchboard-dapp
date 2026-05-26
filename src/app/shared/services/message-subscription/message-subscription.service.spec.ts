import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { MessageSubscriptionService } from './message-subscription.service';
import { IamService } from '../iam.service';
import { SwitchboardToastrService } from '../switchboard-toastr.service';
import { NotificationService } from '../notification.service';
import { provideMockStore } from '@ngrx/store/testing';
import { MessagingService } from 'iam-client-lib';

describe('MessageSubscriptionService', () => {
  let service: MessageSubscriptionService;
  let messagingServiceSpy: jasmine.SpyObj<MessagingService>;

  beforeEach(() => {
    messagingServiceSpy = jasmine.createSpyObj('MessagingService', [
      'unsubscribeFrom',
      'subscribeTo',
    ]);
    TestBed.configureTestingModule({
      providers: [
        {
          provide: IamService,
          useValue: {
            messagingService: messagingServiceSpy,
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

  it('should initialize the message subscription without waiting for it to resolve', fakeAsync(() => {
    let resolveSubscription: (subscriptionId: number) => void = () => undefined;
    messagingServiceSpy.subscribeTo.and.returnValue(
      new Promise((resolve) => {
        resolveSubscription = resolve;
      }) as any
    );

    service.init();

    expect(messagingServiceSpy.subscribeTo).toHaveBeenCalledTimes(1);

    service.init();

    expect(messagingServiceSpy.subscribeTo).toHaveBeenCalledTimes(1);

    resolveSubscription(1);
    tick();

    service.init();

    expect(messagingServiceSpy.subscribeTo).toHaveBeenCalledTimes(1);
  }));

  it('should not throw when the message subscription fails', fakeAsync(() => {
    spyOn(console, 'error');
    messagingServiceSpy.subscribeTo.and.returnValue(
      Promise.reject(new Error('connection failed')) as any
    );

    expect(() => service.init()).not.toThrow();
    tick();

    expect(console.error).toHaveBeenCalled();
  }));

  it('should only unsubscribe when a subscription exists', fakeAsync(() => {
    messagingServiceSpy.subscribeTo.and.returnValue(Promise.resolve(1) as any);

    service.ngOnDestroy();

    expect(messagingServiceSpy.unsubscribeFrom).not.toHaveBeenCalled();

    service.init();
    tick();
    service.ngOnDestroy();

    expect(messagingServiceSpy.unsubscribeFrom).toHaveBeenCalledOnceWith(1);
  }));
});
