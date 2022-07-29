import { Timestamp } from './timestamp';

describe('time-duration', () => {
  let timestamp: Timestamp;

  beforeEach(() => {
    timestamp = new Timestamp();
  });

  it('create an instance', () => {
    expect(timestamp).toBeTruthy();
  });

  it('should parse to ms if time units are provided', () => {
    const timeUnits = { years: 0, days: 4, hours: 4, minutes: 3, seconds: 0 };
    const result = timestamp.parseToMilliseconds(timeUnits);
    expect(result).toEqual(360180000);
  });

  it('should return null if no time units are provided', () => {
    const timeUnits = { years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
    const result = timestamp.parseToMilliseconds(timeUnits);
    expect(result).toEqual(null);
  });
});
