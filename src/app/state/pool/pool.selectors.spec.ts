import * as poolSelectors from './pool.selectors';
import { getMaxPossibleAmountToStake } from './pool.selectors';
import { BigNumber } from 'ethers';
import { MAX_STAKE_AMOUNT } from './models/const';

describe('Pool Selectors', () => {

  describe('getBalance', () => {
    it('should return undefined when passing empty state object', () => {
      expect(poolSelectors.getBalance.projector({})).toBeUndefined();
    });
  });

  describe('getMaxPossibleAmountToStake', () => {
    it('should return MAX_STAKE_AMOUNT value when amount is not specified', () => {
      expect(poolSelectors.getMaxPossibleAmountToStake.projector({})).toBe(MAX_STAKE_AMOUNT);
    });

    it('should calculate max possible amount when is already putted 100', () => {
      expect(poolSelectors.getMaxPossibleAmountToStake.projector({amount: BigNumber.from(100)})).toEqual(49900);
    });

    it('should return 0 when amount is equal to maximum stake amount', () => {
      expect(poolSelectors.getMaxPossibleAmountToStake.projector({amount: BigNumber.from(MAX_STAKE_AMOUNT)})).toEqual(0);
    });

    it('should return maximu stake amount when amount is equal to 0', () => {
      expect(poolSelectors.getMaxPossibleAmountToStake.projector({amount: BigNumber.from(0)})).toEqual(MAX_STAKE_AMOUNT);
    });
  });

});
