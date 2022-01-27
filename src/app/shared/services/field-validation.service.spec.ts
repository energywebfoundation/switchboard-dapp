import { TestBed } from '@angular/core/testing';

import { FieldValidationService } from './field-validation.service';

describe('FieldValidationService', () => {
  let service: FieldValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [FieldValidationService] });
  });

  it('should be created', () => {
    service = TestBed.inject(FieldValidationService);
    expect(service).toBeTruthy();
  });
});
