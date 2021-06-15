import * as UserSelectors from './user.selectors';
import { AssetProfile } from 'iam-client-lib';

describe('User Selectors', () => {

  describe('profile', () => {
    it('should return undefined when initial state is empty object', () => {
      expect(UserSelectors.getUserProfile.projector({})).toBeUndefined();
    });

    it('should return empty profile object', () => {
      expect(UserSelectors.getUserProfile.projector({
        profile: {},
      })).toEqual({});
    });

    it('should return empty string when profile name is not specified', () => {
      expect(UserSelectors.getUserName.projector({})).toEqual('');
    });

    it('should return value specified in profile', () => {
      const name = 'name';
      expect(UserSelectors.getUserName.projector({name})).toEqual(name);
    });

    it('should return undefined when assetProfiles are not defined', () => {
      expect(UserSelectors.getAssetProfile('1').projector({})).toBeUndefined();
    });

    it('should return undefined when assetProfiles is an empty object', () => {
      expect(UserSelectors.getAssetProfile('1').projector({assetProfiles: {}})).toBeUndefined();
    });

    it('should return value when assetProfiles contains id', () => {
      expect(UserSelectors.getAssetProfile('1').projector({assetProfiles: {1: '123'}})).toEqual('123' as AssetProfile);
    });
  });

  describe('did document', () => {
    it('should return undefined when passing empty state object', () => {
      expect(UserSelectors.getDid.projector({})).toBeUndefined();
    });

    it('should return undefined when passing empty did document object', () => {
      expect(UserSelectors.getDid.projector({didDocument: {}})).toBeUndefined();
    });

    it('should return id of specified did document', () => {
      expect(UserSelectors.getDid.projector({didDocument: {id: 'test'}})).toEqual('test');
    });
  });

});
