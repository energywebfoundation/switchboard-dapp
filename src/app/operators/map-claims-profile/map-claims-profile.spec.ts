import { TestScheduler } from 'rxjs/testing';
import { mapClaimsProfile } from './map-claims-profile';

describe('MapClaimsProfile', () => {
  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should return empty object when there is no object with profile property.', () => {
    scheduler.run(({ cold, expectObservable }) => {
      const source$ = cold('-a-|', { a: [] as any });
      const expected$ = '-z-|';

      const result$ = source$.pipe(mapClaimsProfile());

      expectObservable(result$).toBe(expected$, { z: {} });
    });
  });

  it('should return empty object when array contains one object with empty profile and iat', () => {
    scheduler.run(({ cold, expectObservable }) => {
      const source$ = cold('-a-|', { a: [{ profile: {}, iat: 2 }] as any });
      const expected$ = '-z-|';

      const result$ = source$.pipe(mapClaimsProfile());

      expectObservable(result$).toBe(expected$, { z: {} });
    });
  });

  it('should get newest profile', () => {
    scheduler.run(({ cold, expectObservable }) => {
      const expectedObject = { name: 'newer' };
      const source$ = cold('-a-|', {
        a: [
          { profile: { name: 'old' }, iat: 2 },
          { profile: expectedObject, iat: 3 },
        ] as any,
      });
      const expected$ = '-z-|';

      const result$ = source$.pipe(mapClaimsProfile());

      expectObservable(result$).toBe(expected$, { z: expectedObject });
    });
  });
});
