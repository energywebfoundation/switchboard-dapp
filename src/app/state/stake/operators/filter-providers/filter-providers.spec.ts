/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestScheduler } from 'rxjs/testing';
import { filterProviders } from './filter-providers';

describe('FilterProviders', () => {
  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should return empty list if services and organizations are empty', () => {
    scheduler.run(({ cold, expectObservable }) => {
      const source$ = cold('-a-|', { a: [[], []] as any });
      const expected$ = '-z-|';

      const result$ = source$.pipe(filterProviders());

      expectObservable(result$).toBe(expected$, { z: [] });
    });
  });

  it('should return empty list when array providers list is empty', () => {
    scheduler.run(({ cold, expectObservable }) => {
      const source$ = cold('-a-|', { a: [[], [{}, {}]] as any });
      const expected$ = '-z-|';

      const result$ = source$.pipe(filterProviders());

      expectObservable(result$).toBe(expected$, { z: [] });
    });
  });

  it('should return list of providers', () => {
    scheduler.run(({ cold, expectObservable }) => {
      const source$ = cold('-a-|', {
        a: [
          [{ org: 'iam.ewc' }],
          [{ namespace: '' }, { namespace: 'iam.ewc', name: 'iam' }],
        ] as any,
      });
      const expected$ = '-z-|';

      const result$ = source$.pipe(filterProviders());

      expectObservable(result$).toBe(expected$, {
        z: [{ namespace: 'iam.ewc', org: 'iam.ewc', name: 'iam' }],
      });
    });
  });
});
