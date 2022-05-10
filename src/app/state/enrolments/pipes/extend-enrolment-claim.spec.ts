import { TestScheduler } from 'rxjs/testing';
import { extendEnrolmentClaim } from './extend-enrolment-claim';

describe('extendEnrolmentClaim', () => {
  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should return object with roleName and requestDate', () => {
    scheduler.run(({ cold, expectObservable }) => {
      const example = {
        claimType: 'role.roles.org.iam.ewc',
        createdAt: '2021-12-06T20:43:35.471Z',
      };
      const source$ = cold('-a-|', {
        a: [example] as any,
      });
      const expected$ = '-z-|';

      const result$ = source$.pipe(extendEnrolmentClaim());

      expectObservable(result$).toBe(expected$, {
        z: [
          {
            ...example,
            roleName: 'role',
            requestDate: new Date(example.createdAt),
          },
        ],
      });
    });
  });
});
