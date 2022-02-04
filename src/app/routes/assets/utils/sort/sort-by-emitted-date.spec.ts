import { sortByEmittedDate } from './sort-by-emitted-date';

describe('sortByEmittedDate function', () => {
  it('should create', () => {
    const data = [];
    expect(sortByEmittedDate(data)).toBeTruthy();
  });

  it('should sort array by looking on property', () => {
    const shouldBeSecondDate = new Date('2021-05-18T19:44:45.000Z');
    const shouldBeFirstDate = new Date('2021-05-18T19:43:40.000Z');
    const data = [
      { emittedDate: shouldBeSecondDate },
      { emittedDate: shouldBeFirstDate },
    ];

    expect(sortByEmittedDate(data)[0]).toEqual(
      jasmine.objectContaining({ emittedDate: shouldBeFirstDate })
    );
    expect(sortByEmittedDate(data)[1]).toEqual(
      jasmine.objectContaining({ emittedDate: shouldBeSecondDate })
    );
  });
});
