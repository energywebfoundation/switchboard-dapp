import { TestBed } from '@angular/core/testing';

import { DidBookHttpService } from './did-book-http.service';

describe('DidBookHttpService', () => {
  let service: DidBookHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DidBookHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
