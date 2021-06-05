import * as UserSelectors from './user.selectors';

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
