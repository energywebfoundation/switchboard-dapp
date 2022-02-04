import { FormControl } from '@angular/forms';
import { ListValidator } from './list.validator';

describe('tests for ListValidator', () => {
  describe('stringExist', () => {
    it('should return null when passing empty string', () => {
      expect(ListValidator.stringExist([])(new FormControl(''))).toEqual(null);
    });

    it('should return null when passing form control with empty value, but source is not empty', () => {
      expect(ListValidator.stringExist(['value'])(new FormControl(''))).toEqual(
        null
      );
    });

    it('should return null when passing form control with empty value but source is empty', () => {
      expect(ListValidator.stringExist([])(new FormControl('value'))).toEqual(
        null
      );
    });

    it('should return exist equal to true when passing form control with list containing the same value', () => {
      expect(
        ListValidator.stringExist(['value'])(new FormControl('value'))
      ).toEqual({ exist: true });
    });

    it('should return null when form and source are not empty but are different', () => {
      expect(
        ListValidator.stringExist(['value1'])(new FormControl('value'))
      ).toEqual(null);
    });
  });
});
