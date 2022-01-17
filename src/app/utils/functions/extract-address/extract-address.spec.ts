import { extractAddress } from './extract-address';

describe('extractAddress function', () => {
  const stringWithLength = (length): string => {
    return new Array(length + 1).join('a');
  };

  it('should return same string when value is not a did', () => {
    expect(extractAddress('a')).toEqual('a');
  });

  it('should return did address when passed a did', () => {
    expect(extractAddress('did:ethr:0x' + stringWithLength(40))).toEqual(
      '0x' + stringWithLength(40)
    );
  });
});
