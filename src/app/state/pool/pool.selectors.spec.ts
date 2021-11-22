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
      expect(poolSelectors.getMaxPossibleAmountToStake.projector({}, {contributorLimit: BigNumber.from('0x1b1ae4d6e2ef500000')})).toBe(500);
    });

    it('should calculate max possible amount when is already putted 100', () => {
      expect(poolSelectors.getMaxPossibleAmountToStake.projector({amount: BigNumber.from('0x1bc16d674ec80000')}, {contributorLimit: BigNumber.from('0x1b1ae4d6e2ef500000')})).toEqual(498);
    });

    it('should return 0 when amount is equal to maximum stake amount', () => {
      expect(poolSelectors.getMaxPossibleAmountToStake.projector({amount: BigNumber.from('0x1b1ae4d6e2ef500000')}, {contributorLimit: BigNumber.from('0x1b1ae4d6e2ef500000')})).toEqual(0);
    });

    it('should return maximum stake amount when amount is equal to 0', () => {
      expect(poolSelectors.getMaxPossibleAmountToStake.projector({amount: BigNumber.from(0)}, {contributorLimit: BigNumber.from('0x1b1ae4d6e2ef500000')})).toEqual(500);
    });

    it('should return default value when contributorLimit is undefined', () => {
      expect(poolSelectors.getMaxPossibleAmountToStake.projector({}, {})).toBe(MAX_STAKE_AMOUNT);
    });

    it('should return contributionLimit when amount is null', () => {
      expect(poolSelectors.getMaxPossibleAmountToStake.projector({amount: null}, {contributorLimit: BigNumber.from('0x1b1ae4d6e2ef500000')})).toBe(500);
    });
  });

});
