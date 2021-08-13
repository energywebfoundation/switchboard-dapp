import { TestScheduler } from 'rxjs/testing';
import { mapToProviders } from './map-to-providers';

describe('MapToProviders', () => {
  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler(((actual, expected) => {
      expect(actual).toEqual(expected);
    }));
  });

  it('should return empty list if services and organizations are empty', () => {
    scheduler.run(({cold, expectObservable}) => {
      const source$ = cold('-a-|', {a: [[], []] as any});
      const expected$ = '-z-|';

      const result$ = source$.pipe(mapToProviders());

      expectObservable(result$).toBe(expected$, {z: []});
    });
  });

  it('should return empty list when array providers list is empty', () => {
    scheduler.run(({cold, expectObservable}) => {
      const source$ = cold('-a-|', {a: [[], [{}, {}]] as any});
      const expected$ = '-z-|';

      const result$ = source$.pipe(mapToProviders());

      expectObservable(result$).toBe(expected$, {z: []});
    });
  });

  it('should return list of providers', () => {
    scheduler.run(({cold, expectObservable}) => {
      const expectedObject = {name: 'newer'};
      const source$ = cold('-a-|', {
        a: [[{org: 'iam.ewc'}], [{namespace: ''}, {namespace: 'iam.ewc', name: 'iam'}]] as any
      });
      const expected$ = '-z-|';

      const result$ = source$.pipe(mapToProviders());

      expectObservable(result$).toBe(expected$, {z: [{namespace: 'iam.ewc', org: 'iam.ewc', name: 'iam'}]});
    });
  });
});
