import { LastDigitsPipe } from './last-digits.pipe';

describe('LastDigitsPipe', () => {
  const pipe = new LastDigitsPipe();
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return undefined when get undefined', () => {
    expect(pipe.transform(undefined)).toBeUndefined();
  });

  it('should return same string, when it do not have dot inside', () => {
    expect(pipe.transform('123')).toEqual('123');
  });

  it('should return same string when gets 3 digits after a dot', () => {
    expect(pipe.transform('12.345')).toEqual('12.345');
  });

  it('should cut part of string when it have more than 3 digits after a dot', () => {
    expect(pipe.transform('1.123456')).toEqual('1.123');
  });

  it('should return 0 when gets 0', () => {
    expect(pipe.transform('0')).toEqual('0');
  });
});
