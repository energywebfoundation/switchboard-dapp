import { TestBed, waitForAsync } from '@angular/core/testing';

import { SwitchboardToastrService } from './switchboard-toastr.service';
import { ToastrService } from 'ngx-toastr';

describe('SwitchboardToastrService', () => {
  let service: SwitchboardToastrService;
  const toastrSpyObj = jasmine.createSpyObj('ToastrService', [
    'success',
    'show',
    'error',
    'info',
    'warning',
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: ToastrService, useValue: toastrSpyObj }],
    });
    service = TestBed.inject(SwitchboardToastrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should clean list elements', waitForAsync(() => {
    service.success('test');
    service.reset();
    service.getMessageList().subscribe((list) => {
      expect(list).toEqual([]);
    });
  }));

  it('should mark all items as read', () => {
    service.success('test');
    const expectedResult = {
      message: 'test',
      type: 'toast-success',
      isNew: false,
    };
    service.readAll();
    service.getMessageList().subscribe((list) => {
      expect(list).toEqual([expectedResult]);
    });
  });

  it('should display toastr message', () => {
    const message = 'message test';
    const title = 'title test';
    const override = {};
    const type = 'type test';

    service.show(message, title, override, type);
    expect(toastrSpyObj.show).toHaveBeenCalledWith(
      message,
      title,
      override,
      type
    );
  });

  it('should display error toastr message', () => {
    const message = 'message test';
    const title = 'title test';
    const override = {};

    service.error(message, title, override);
    expect(toastrSpyObj.error).toHaveBeenCalledWith(message, title, override);
  });

  it('should display info toastr message', () => {
    const message = 'message test';
    const title = 'title test';
    const override = {};

    service.info(message, title, override);
    expect(toastrSpyObj.info).toHaveBeenCalledWith(message, title, override);
  });

  it('should display succcess toastr message', () => {
    const message = 'message test';
    const title = 'title test';
    const override = {};

    service.success(message, title, override);
    expect(toastrSpyObj.success).toHaveBeenCalledWith(message, title, override);
  });

  it('should display warning toastr message', () => {
    const message = 'message test';
    const title = 'title test';
    const override = {};

    service.warning(message, title, override);
    expect(toastrSpyObj.warning).toHaveBeenCalledWith(message, title, override);
  });

  it('should get 0 when there are no new items', waitForAsync(() => {
    service.newMessagesAmount().subscribe((v) => {
      expect(v).toBe(0);
    });
  }));

  it('should get 1 when there is 1 new item', waitForAsync(() => {
    service.success('Message');

    service.newMessagesAmount().subscribe((v) => {
      expect(v).toBe(1);
    });
  }));

  it('should return true when there are new elements', waitForAsync(() => {
    service.success('Message');

    service.areNewNotifications().subscribe((v) => {
      expect(v).toBeTrue();
    });
  }));

  it('should reset notifications after destroying service', waitForAsync(() => {
    service.success('Message');

    service.ngOnDestroy();

    service.getMessageList().subscribe((v) => {
      expect(v.length).toBe(0);
    });
  }));
});
