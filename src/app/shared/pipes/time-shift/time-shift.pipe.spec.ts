import { TimeShiftPipe } from './time-shift.pipe';

describe('TimeShiftPipe', () => {
  let pipe;

  beforeEach(() => {
    pipe = new TimeShiftPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return same date when shift is equal to 0', () => {
    const exampleDate = new Date('2014-01-01 10:11:55');
    expect(pipe.transform(0, exampleDate)).toEqual(exampleDate);
  });

  it('should return date shifted for 100 seconds', () => {
    const exampleDate = new Date('2014-01-01 10:11:55');
    expect(pipe.transform(100000, exampleDate)).toEqual(
      new Date('2014-01-01 10:13:35')
    );
  });
});
