import { TestBed } from '@angular/core/testing';

import { SwitchboardToastr, SwitchboardToastrService } from './switchboard-toastr.service';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

describe('SwitchboardToastrService', () => {
  let service: SwitchboardToastrService;
  const toastrSpyObj = jasmine.createSpyObj('ToastrService',
      [
        'success',
        'show',
        'error',
        'info',
        'warning',
      ]
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ToastrService, useValue: toastrSpyObj }]
    });
    service = TestBed.inject(SwitchboardToastrService);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be run reset', () => {
    (service as any).messageList = new BehaviorSubject<SwitchboardToastr[]>([{
      isNew: true,
      message: 'test',
      type: 'test'
    }]);
    spyOn(service, 'reset');
    service.reset();
    expect(service.reset).toHaveBeenCalled();
    expect((service as any).messageList.getValue.length).toBe(0);
  });

  it('should be run getMessageList', () => {
    spyOn(service, 'getMessageList');
    service.getMessageList();
    expect(service.getMessageList).toHaveBeenCalled();
  });

  it('should be run readAllItems', () => {
    (service as any).messageList = new BehaviorSubject<SwitchboardToastr[]>([{
      isNew: true,
      message: 'test',
      type: 'test'
    }]);
    spyOn(service, 'readAllItems');
    service.readAllItems();
    expect(service.readAllItems).toHaveBeenCalled();
  });

  it('should be run show', () => {
    const message = 'message test';
    const title = 'title test';
    const override = {};
    const type = 'type test';

    service.show(message, title, override, type);
    expect(toastrSpyObj.show).toHaveBeenCalledWith(message, title, override, type);
  });

  it('should be run error', () => {
    const message = 'message test';
    const title = 'title test';
    const override = {};

    service.error(message, title, override);
    expect(toastrSpyObj.error).toHaveBeenCalledWith(message, title, override);
  });

  it('should be run info', () => {
    const message = 'message test';
    const title = 'title test';
    const override = {};

    service.info(message, title, override);
    expect(toastrSpyObj.info).toHaveBeenCalledWith(message, title, override);
  });

  it('should be run success', () => {
    const message = 'message test';
    const title = 'title test';
    const override = {};

    service.success(message, title, override);
    expect(toastrSpyObj.success).toHaveBeenCalledWith(message, title, override);
  });

  it('should be run warning', () => {
    const message = 'message test';
    const title = 'title test';
    const override = {};

    service.warning(message, title, override);
    expect(toastrSpyObj.warning).toHaveBeenCalledWith(message, title, override);
  });
});
