import { userLocalStorage } from './local-storage-wrapper';

describe('LocalStorageWrapper', () => {
  const KEY = 'userData';

  afterEach(() => localStorage.removeItem(KEY));

  describe('parsed', () => {
    it('returns null (not undefined) when the stored value is not valid JSON', () => {
      localStorage.setItem(KEY, 'not-json{');
      expect(userLocalStorage.parsed).toBeNull();
    });

    it('returns null when nothing is stored', () => {
      localStorage.removeItem(KEY);
      expect(userLocalStorage.parsed).toBeNull();
    });

    it('round-trips a valid value', () => {
      const value = { name: 'a', birthdate: 'b', address: 'c' };
      userLocalStorage.parsed = value;
      expect(userLocalStorage.parsed).toEqual(value);
    });
  });
});
