import * as stakeSelectors from './stake.selectors';

describe('Stake Selectors', () => {
  it('should return list of providers', () => {
    expect(
      stakeSelectors.getProviders.projector({ providers: [1, 2] })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ).toEqual([1, 2] as any);
  });

  it('should return undefined when providers property do not exist', () => {
    expect(stakeSelectors.getProviders.projector({})).toEqual(undefined);
  });
});
