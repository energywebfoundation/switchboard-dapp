import { TestBed } from '@angular/core/testing';

import { DidBookService } from './did-book.service';
import { DidBookHttpService } from './did-book-http.service';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { toastrSpy } from '@tests';

describe('DidBookService', () => {
  let service: DidBookService;
  const didBookHttpServiceSpy = jasmine.createSpyObj(DidBookHttpService, ['getList', 'add', 'delete']);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DidBookService,
        {provide: DidBookHttpService, useValue: didBookHttpServiceSpy},
        {provide: SwitchboardToastrService, useValue: toastrSpy}
      ]
    });
    service = TestBed.inject(DidBookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
