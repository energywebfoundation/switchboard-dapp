import { deepEqualObjects } from './deep-equal-objects';

describe('compare-form-with-defaults function', () => {
  it('should return false when first object is undefined', () => {
    expect(deepEqualObjects(undefined, {})).toEqual(false);
  });

  it('should return false when second object is undefined', () => {
    expect(deepEqualObjects({}, undefined)).toEqual(false);
  });

  it('should return false when both objects are undefined', () => {
    expect(deepEqualObjects({}, undefined)).toEqual(false);
  });

  it('should check empty objects', () => {
    expect(deepEqualObjects({}, {})).toEqual(true);
  });

  it('should return false, when objects does not contain the same amount of keys', () => {
    expect(deepEqualObjects({}, { value: 1 })).toEqual(false);
  });

  it('should return false, when objects contains different properties', () => {
    expect(deepEqualObjects({ first: 1 }, { second: 2 })).toEqual(false);
  });

  it('should return true, when objects contains the same properties', () => {
    expect(deepEqualObjects({ value: 1 }, { value: 1 })).toEqual(true);
  });

  it('should return false, when properties in objects are different objects', () => {
    expect(
      deepEqualObjects({ value: { value: 1 } }, { value: { value: 2 } })
    ).toEqual(false);
  });

  it('should return true, when properties in objects are the same objects', () => {
    expect(
      deepEqualObjects({ value: { value: 1 } }, { value: { value: 1 } })
    ).toEqual(true);
  });

  it('should check if compared the same date returns true', () => {
    expect(
      deepEqualObjects(
        { value: new Date('6/7/1981') },
        { value: new Date('6/7/1981') }
      )
    ).toEqual(true);
  });

  it('should check if compared different dates return false', () => {
    expect(
      deepEqualObjects(
        { value: new Date('6/7/1981') },
        { value: new Date('1/1/2001') }
      )
    ).toEqual(false);
  });
});
