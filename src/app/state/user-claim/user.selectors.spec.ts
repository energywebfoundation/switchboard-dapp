import * as userSelectors from './user.selectors';
import { claimRoleNames } from './user.selectors';
import { AssetProfile } from 'iam-client-lib';

describe('User Selectors', () => {
  describe('profile', () => {
    it('should return undefined when initial state is empty object', () => {
      expect(userSelectors.getUserProfile.projector({})).toBeUndefined();
    });

    it('should return empty profile object', () => {
      expect(
        userSelectors.getUserProfile.projector({
          profile: {},
        })
      ).toEqual({});
    });

    it('should return empty string when profile name is not specified', () => {
      expect(userSelectors.getUserName.projector({})).toEqual('');
    });

    it('should return value specified in profile', () => {
      const name = 'name';
      expect(userSelectors.getUserName.projector({ name })).toEqual(name);
    });

    it('should return undefined when assetProfiles are not defined', () => {
      expect(userSelectors.getAssetProfile('1').projector({})).toBeUndefined();
    });

    it('should return undefined when assetProfiles is an empty object', () => {
      expect(
        userSelectors.getAssetProfile('1').projector({ assetProfiles: {} })
      ).toBeUndefined();
    });

    it('should return value when assetProfiles contains id', () => {
      expect(
        userSelectors
          .getAssetProfile('1')
          .projector({ assetProfiles: { 1: '123' } })
      ).toEqual('123' as AssetProfile);
    });
  });

  describe('did document', () => {
    it('should return undefined when passing empty state object', () => {
      expect(userSelectors.getDid.projector({})).toBeUndefined();
    });

    it('should return undefined when passing empty did document object', () => {
      expect(
        userSelectors.getDid.projector({ didDocument: {} })
      ).toBeUndefined();
    });

    it('should return id of specified did document', () => {
      expect(
        userSelectors.getDid.projector({ didDocument: { id: 'test' } })
      ).toEqual('test');
    });
  });

  describe('getUserRoleClaims', () => {
    it('should filter out claims that are not roles', () => {
      const claims = [{ claimType: 'will-be-filtered' }];
      expect(userSelectors.getUserRoleClaims.projector(claims)).toEqual([]);
    });

    it('should pass further claim that is role', () => {
      const claims = [{ claimType: 'valid.roles.org.iam.ewc' }];
      expect(userSelectors.getUserRoleClaims.projector(claims)).toEqual(
        claims as any
      );
    });
  });

  describe('claimRoleNames', () => {
    it('should get list of role names', () => {
      const roleName = 'some.roles.';
      const claims = [{ claimType: roleName }];
      expect(userSelectors.claimRoleNames.projector(claims)).toEqual([
        roleName,
      ]);
    });
  });
});
