import { TestBed } from '@angular/core/testing';

import { MessagingFacadeService } from './messaging-facade.service';

describe('MessagingFacadeService', () => {
  let service: MessagingFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessagingFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
