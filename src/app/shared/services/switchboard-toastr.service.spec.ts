import { TestBed } from '@angular/core/testing';

import { SwitchboardToastr, SwitchboardToastrService } from './switchboard-toastr.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

fdescribe('SwitchboardToastrService', () => {
  let service: SwitchboardToastrService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastrService],
      imports: [ToastrModule.forRoot()]
    });
    service = TestBed.inject(SwitchboardToastrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be run reset', () => {
    (service as any).massageList = new BehaviorSubject<SwitchboardToastr[]>([{
      isNew: true,
      message: 'test',
      type: 'test'
    }]);
    spyOn(service, 'reset');
    service.reset();
    expect(service.reset).toHaveBeenCalled();
    expect((service as any).massageList.getValue.length).toBe(0);
  });

  it('should be run getMessageList', () => {
    spyOn(service, 'getMessageList');
    service.getMessageList();
    expect(service.getMessageList).toHaveBeenCalled();
  });

  it('should be run readAllItems', () => {
    (service as any).massageList = new BehaviorSubject<SwitchboardToastr[]>([{
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

    spyOn(service, 'show');
    service.show(message, title, override, type);
    expect(service.show).toHaveBeenCalledWith(message, title, override, type);
  });

  it('should be run error', () => {
    const message = 'message test';
    const title = 'title test';
    const override = {};

    spyOn(service, 'error');
    service.error(message, title, override);
    expect(service.error).toHaveBeenCalledWith(message, title, override);
  });

  it('should be run info', () => {
    const message = 'message test';
    const title = 'title test';
    const override = {};

    spyOn(service, 'info');
    service.info(message, title, override);
    expect(service.info).toHaveBeenCalledWith(message, title, override);
  });

  it('should be run success', () => {
    const message = 'message test';
    const title = 'title test';
    const override = {};

    spyOn(service, 'success');
    service.success(message, title, override);
    expect(service.success).toHaveBeenCalledWith(message, title, override);
  });

  it('should be run warning', () => {
    const message = 'message test';
    const title = 'title test';
    const override = {};

    spyOn(service, 'warning');
    service.warning(message, title, override);
    expect(service.warning).toHaveBeenCalledWith(message, title, override);
  });

  it('should be run updateMessageList', () => {
    const message = 'message test';
    const type = 'type test';

    spyOn((service as any), 'updateMessageList');
    (service as any).updateMessageList(message, type);
    expect((service as any).updateMessageList).toHaveBeenCalledWith(message, type);
  });

});
