import { parseStringToFloat } from './parse-string-to-float';

describe('parseStringToFloat function', () => {
  it('should parse 0 string', () => {
    expect(parseStringToFloat('0')).toEqual(0);
  });

  it('should parse 1.0', () => {
    expect(parseStringToFloat('1.0')).toEqual(1);
  });

  it('should parse 1.1', () => {
    expect(parseStringToFloat('1.1')).toEqual(1.1);
  });

  it('should parse 1.0000001', () => {
    expect(parseStringToFloat('1.0000001')).toEqual(1.0);
  });

  it('should parse 1.00001', () => {
    expect(parseStringToFloat('1.00001')).toEqual(1.00001);
  });
});
