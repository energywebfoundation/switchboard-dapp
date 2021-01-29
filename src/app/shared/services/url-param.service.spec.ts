import { TestBed } from '@angular/core/testing';

import { UrlParamService } from './url-param.service';

describe('UrlParamService', () => {
  let service: UrlParamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UrlParamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
