import * as stakeSelectors from './stake.selectors';
import { StakeStatus } from 'iam-client-lib';

describe('User Selectors', () => {

  describe('getBalance', () => {
    it('should return undefined when passing empty state object', () => {
      expect(stakeSelectors.getBalance.projector({})).toBeUndefined();
    });

  });

  describe('isStakingDisabled', () => {
    it('should return false when user is not logged in and status is nonstaking', () => {
      expect(stakeSelectors.isStakingDisabled.projector({status: StakeStatus.NONSTAKING}, false)).toBe(false);
    });

    it('should return false when logged in and status is nonstaking', () => {
      expect(stakeSelectors.isStakingDisabled.projector({status: StakeStatus.NONSTAKING}, true)).toBe(false);
    });

    it('should return true when user logged in and status is staking', () => {
      expect(stakeSelectors.isStakingDisabled.projector({status: StakeStatus.STAKING}, true)).toBe(true);
    });

    it('should return true when user logged in and status is withdrawing', () => {
      expect(stakeSelectors.isStakingDisabled.projector({status: StakeStatus.WITHDRAWING}, true)).toBe(true);
    })
  })

});
