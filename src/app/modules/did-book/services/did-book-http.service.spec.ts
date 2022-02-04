import { TestBed } from '@angular/core/testing';

import { DidBookHttpService } from './did-book-http.service';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from '../../../shared/services/loading.service';
import { loadingServiceSpy } from '@tests';
import { EnvService } from '../../../shared/services/env/env.service';

describe('DidBookHttpService', () => {
  let service: DidBookHttpService;
  const httpSpy = jasmine.createSpyObj(HttpClient, ['get', 'post', 'delete']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DidBookHttpService,
        { provide: HttpClient, useValue: httpSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: EnvService, useValue: {} },
      ],
    });
    service = TestBed.inject(DidBookHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
