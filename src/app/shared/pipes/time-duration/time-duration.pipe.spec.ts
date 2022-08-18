import { TimeDurationPipe } from './time-duration.pipe';

const YEAR_IN_MILISECONDS = 31536000 * 1000;
const DAY_IN_MILISECONDS = 86400 * 1000;
const HOUR_IN_MILISECONDS = 3600 * 1000;
const MINUTE_IN_MILISECONDS = 60000;

describe('time-duration', () => {
  let pipe: TimeDurationPipe;

  beforeEach(() => {
    pipe = new TimeDurationPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return 1 day', () => {
    expect(pipe.transform(DAY_IN_MILISECONDS)).toEqual('1 day');
  });

  it('should return 1 year', () => {
    expect(pipe.transform(YEAR_IN_MILISECONDS)).toEqual('1 year');
  });

  it('should return 2 days', () => {
    expect(pipe.transform(2 * DAY_IN_MILISECONDS)).toEqual('2 days');
  });

  it('should return 1 hour', () => {
    expect(pipe.transform(HOUR_IN_MILISECONDS)).toEqual('1 hour');
  });

  it('should return 2 hours', () => {
    expect(pipe.transform(2 * HOUR_IN_MILISECONDS)).toEqual('2 hours');
  });

  it('should return 2 minutes', () => {
    expect(pipe.transform(2 * MINUTE_IN_MILISECONDS)).toEqual('2 minutes');
  });

  it('should return 2 days and 3 hours', () => {
    expect(
      pipe.transform(2 * DAY_IN_MILISECONDS + 3 * HOUR_IN_MILISECONDS)
    ).toEqual('2 days and 3 hours');
  });

  it('should return 2 days, 3 hours and 5 minutes', () => {
    expect(
      pipe.transform(
        2 * DAY_IN_MILISECONDS +
          3 * HOUR_IN_MILISECONDS +
          5 * MINUTE_IN_MILISECONDS
      )
    ).toEqual('2 days, 3 hours and 5 minutes');
  });

  it('should return 2 days, 3 hours, 5 minutes and 32 seconds', () => {
    expect(
      pipe.transform(
        2 * DAY_IN_MILISECONDS +
          3 * HOUR_IN_MILISECONDS +
          5 * MINUTE_IN_MILISECONDS +
          32
      )
    ).toEqual('2 days, 3 hours, 5 minutes and 32 seconds');
  });

  it('should return 1 year, 2 days, 3 hours, 5 minutes and 32 seconds', () => {
    expect(
      pipe.transform(
        YEAR_IN_MILISECONDS +
          2 * DAY_IN_MILISECONDS +
          3 * HOUR_IN_MILISECONDS +
          5 * MINUTE_IN_MILISECONDS +
          32
      )
    ).toEqual('1 year, 2 days, 3 hours, 5 minutes and 32 seconds');
  });

  it('should return 5 hours, 3 minutes and 1 second', () => {
    expect(
      pipe.transform(5 * HOUR_IN_MILISECONDS + 3 * MINUTE_IN_MILISECONDS + 1)
    ).toEqual('5 hours, 3 minutes and 1 second');
  });

  it('should return 0 seconds', () => {
    expect(pipe.transform(0)).toEqual('---');
  });

  it('should return default text when value is less than 0', () => {
    expect(pipe.transform(-10)).toEqual('---');
  });

  it('should return text when passing object', () => {
    expect(
      pipe.transform({ years: 1, days: 2, hours: 3, minutes: 5, seconds: 32 })
    ).toEqual('1 year, 2 days, 3 hours, 5 minutes and 32 seconds');
  });

  it('should return default text when passing object with empty properties', () => {
    expect(
      pipe.transform({
        years: undefined,
        days: undefined,
        hours: undefined,
        minutes: undefined,
        seconds: undefined,
      })
    ).toEqual('---');
  });
});
