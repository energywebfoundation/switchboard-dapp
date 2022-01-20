import { FormControl } from '@angular/forms';
import { isAlphanumericValidator } from './is-alphanumeric.validator';

describe('tests for isAlphanumericValidator', () => {
  it('should return null when passing empty string', () => {
    expect(isAlphanumericValidator(new FormControl(''))).toEqual(null);
  });

  it('should return true when value is only a whitespace', () => {
    expect(isAlphanumericValidator(new FormControl(' '))).toEqual({
      isAlphaNumericInvalid: true,
    });
  });

  it('should return true when value contains whitespace between characters', () => {
    expect(isAlphanumericValidator(new FormControl('a b'))).toEqual({
      isAlphaNumericInvalid: true,
    });
  });

  it('should return null when passing a value without whitespaces', () => {
    expect(isAlphanumericValidator(new FormControl('ab12ZX'))).toEqual(null);
  });

  it('should true when contains special characters', () => {
    expect(isAlphanumericValidator(new FormControl('@!'))).toEqual({
      isAlphaNumericInvalid: true,
    });
  });
});
