import { TestBed } from '@angular/core/testing';

import { UrlParamService } from './url-param.service';

describe('UrlParamService', () => {
  let service: UrlParamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(UrlParamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
