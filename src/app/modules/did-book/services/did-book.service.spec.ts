import { TestBed } from '@angular/core/testing';

import { DidBookService } from './did-book.service';

describe('DidBookService', () => {
  let service: DidBookService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DidBookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
