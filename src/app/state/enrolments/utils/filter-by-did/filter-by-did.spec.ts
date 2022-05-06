import { filterByDid } from './filter-by-did';

describe('filterByDid function', () => {
  it('should return the same list when filter value is falsy', () => {
    expect(filterByDid([{} as any], '')).toEqual([{} as any]);
  });

  it('should remove element from list depending on subject property', () => {
    expect(
      filterByDid([{ subject: 'test', requester: '' }, { subject: 'cool', requester: '' }] as any[], 'te')
    ).toEqual([{ subject: 'test', requester:'' }] as any);
  });

  it('should remove element from list depending on requester property', () => {
    expect(
      filterByDid([{ subject: 'test', requester: 'test2' }, { subject: 'cool', requester: '' }] as any[], 'st2')
    ).toEqual([{ subject: 'test', requester:'test2' }] as any);
  });
});
