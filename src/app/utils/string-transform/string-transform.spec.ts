import { StringTransform } from './string-transform';

describe('StringTransform', () => {
  describe('removeWhiteSpaces', () => {
    it('should return same string when it is empty', () => {
      expect(StringTransform.removeWhiteSpaces('')).toEqual('');
    });
    it('should remove spaces from string', () => {
      expect(StringTransform.removeWhiteSpaces(' a ')).toEqual('a');
    });

    it('should remove new line from string', () => {
      expect(StringTransform.removeWhiteSpaces(' \na ')).toEqual('a');
    });
  });
});
