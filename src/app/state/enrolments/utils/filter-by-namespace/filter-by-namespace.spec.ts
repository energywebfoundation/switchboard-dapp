import { filterByNamespace } from './filter-by-namespace';

describe('filterByNamespace function', () => {
  it('should return the same list when filter value is falsy', () => {
    expect(filterByNamespace([{} as any], '')).toEqual([{} as any]);
  });

  it('should remove 1 element from list', () => {
    expect(
      filterByNamespace(
        [{ namespace: 'test' }, { subject: 'cool' }] as any[],
        'te'
      )
    ).toEqual([{ subject: 'test' }] as any);
  });
});
