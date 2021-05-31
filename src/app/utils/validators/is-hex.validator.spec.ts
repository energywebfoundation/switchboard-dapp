import { isHexValidator } from './is-hex.validator';
import { FormControl } from '@angular/forms';

describe('tests for isHexValidator', () => {
  const hexWithoutBeggining66 = 'aaaaaaaaaabbbbbbbbbbccccccccccddddddddddeeeeeeeeeeffffffffff123456';
  const hexWithoutBeggining130 = 'aaaaaaaaaabbbbbbbbbbccccccccccddddddddddeeeeeeeeeeffffffffff123456aaaaaaaaaabbbbbbbbbbccccccccccddddddddddeeeeeeeeeeffffffffff1234';
  it('should return null when passing undefined', () => {
    expect(isHexValidator(new FormControl())).toEqual(null);
  });

  it('should return null when passing empty string', () => {
    expect(isHexValidator(new FormControl(''))).toEqual(null);
  });

  it('should return true when value do not start with 0x', () => {
    expect(isHexValidator(new FormControl('a' + hexWithoutBeggining66))).toEqual({ isHexInvalid: true });
  });

  it('should return false when value start with 0x and is followed by 66 characters', () => {
    expect(isHexValidator(new FormControl('0x' + hexWithoutBeggining66))).toEqual(null);
  });

  it('should return true when value contain less than 66 characters followed by 0x', () => {
    expect(isHexValidator(new FormControl('0x' + '123'))).toEqual({ isHexInvalid: true });
  });

  it('should return false when value start with 0x and is followed by 130 characters', () => {
    expect(isHexValidator(new FormControl('0x' + hexWithoutBeggining130))).toEqual(null);
  });

  it('should return true when value start with 0x and is followed by 67 characters', () => {
    expect(isHexValidator(new FormControl('0x1' + hexWithoutBeggining66))).toEqual({ isHexInvalid: true });
  });

  it('should return true when value start with 0x and is followed by 131 characters', () => {
    expect(isHexValidator(new FormControl('0x1' + hexWithoutBeggining130))).toEqual({ isHexInvalid: true });
  });

  it('should return true when value start with different value but is followed by proper hex', () => {
    expect(isHexValidator(new FormControl('Abc0x' + hexWithoutBeggining66))).toEqual({ isHexInvalid: true });
  });
});
