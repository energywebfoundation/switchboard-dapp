import { FormControl } from '@angular/forms';
import { isUrlValidator } from './is-url.validator';

describe('tests for isUrlValidator', () => {
  it('should return null when passing empty string', () => {
    expect(isUrlValidator()(new FormControl(''))).toEqual(null);
  });

  it('should return null when passing https url', () => {
    expect(isUrlValidator()(new FormControl('https://asd.com'))).toEqual(null);
  });

  it('should return null when passing http url', () => {
    expect(isUrlValidator()(new FormControl('http://asd.com'))).toEqual(null);
  });

  it('should return error when passing random string', () => {
    expect(isUrlValidator()(new FormControl('asd.com'))).toEqual({
      invalidUrl: true,
    });
  });
});
