import { FormControl } from '@angular/forms';
import { isValidJsonFormatValidator } from './is-valid-json-format.validator';

describe('tests for isValidJsonFormatValidator', () => {
  it('should return null when passing undefined', () => {
    expect(isValidJsonFormatValidator(new FormControl(undefined))).toEqual(
      null
    );
  });

  it('should return null when passing empty string', () => {
    expect(isValidJsonFormatValidator(new FormControl(''))).toEqual(null);
  });

  it('should return null when passing whitespaces', () => {
    expect(isValidJsonFormatValidator(new FormControl('     '))).toEqual(null);
  });

  it('should return null when passing empty object', () => {
    expect(isValidJsonFormatValidator(new FormControl('{}'))).toEqual(null);
  });

  it('should return error when passing only opening bracket', () => {
    expect(isValidJsonFormatValidator(new FormControl('{'))).toEqual({
      invalidJsonFormat: true,
    });
  });

  it('should return error when passing only closing bracket', () => {
    expect(isValidJsonFormatValidator(new FormControl('}'))).toEqual({
      invalidJsonFormat: true,
    });
  });

  it('should return null when passing an object with properties as a string', () => {
    expect(
      isValidJsonFormatValidator(new FormControl('{"result":true, "count":42}'))
    ).toEqual(null);
  });

  it('should return error when passing an bad object with props as a string', () => {
    expect(
      isValidJsonFormatValidator(new FormControl('{"result":true, "count":42'))
    ).toEqual({ invalidJsonFormat: true });
  });
});
