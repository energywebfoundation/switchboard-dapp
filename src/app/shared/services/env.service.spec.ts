import { TestBed } from '@angular/core/testing';

import { EnvService } from './env.service';

describe('EnvService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EnvService = TestBed.get(EnvService);
    expect(service).toBeTruthy();
  });
});
