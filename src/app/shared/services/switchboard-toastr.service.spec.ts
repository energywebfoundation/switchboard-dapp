import { TestBed } from '@angular/core/testing';

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ToastrService, useValue: toastrSpyObj }],
    });
    service = TestBed.inject(SwitchboardToastrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should clean list elements', (done) => {
    service.success('test');
    service.reset();
    service.getMessageList().subscribe((list) => {
      expect(list).toEqual([]);
      done();
    });
  });

  it('should mark all items as read', (done) => {
    service.success('test');
    const expectedResult = {
      message: 'test',
      type: 'toast-success',
      isNew: false,
    };
    service.readAll();
    service.getMessageList().subscribe((list) => {
      expect(list).toEqual([expectedResult]);
      done();
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
});
