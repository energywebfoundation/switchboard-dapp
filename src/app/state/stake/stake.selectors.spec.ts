import * as stakeSelectors from './stake.selectors';

describe('User Selectors', () => {

  describe('getBalance', () => {
    it('should return undefined when passing empty state object', () => {
      expect(stakeSelectors.getBalance.projector({})).toBeUndefined();
    });

    it('should pass string and get a number', () => {
      expect(stakeSelectors.getBalance.projector({balance: '1'})).toEqual(1);
    });

  });

});
