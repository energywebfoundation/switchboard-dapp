import { HexValidators } from './is-hex.validator';
import { FormControl, ValidatorFn } from '@angular/forms';

describe('tests for isHexValidator', () => {
  const stringWithLength = (length): string => {
    return new Array(length + 1).join('a');
  };

  describe('tests for isPublicKeyValidValidator', () => {
    const hexWithoutBeginning66 = stringWithLength(66);
    const hexWithoutBeginning130 = stringWithLength(130);
    it('should return null when passing undefined', () => {
      expect(getFormErrors(undefined, HexValidators.isPublicKeyValid)).toEqual(
        null
      );
    });

    it('should return null when passing empty string', () => {
      expect(getFormErrors('', HexValidators.isPublicKeyValid)).toEqual(null);
    });

    it('should return true when value do not start with 0x', () => {
      expect(
        getFormErrors(
          'a' + hexWithoutBeginning66,
          HexValidators.isPublicKeyValid
        )
      ).toEqual({ isHexInvalid: true });
    });

    it('should return null when value start with 0x and is followed by 66 characters', () => {
      expect(
        getFormErrors(
          '0x' + hexWithoutBeginning66,
          HexValidators.isPublicKeyValid
        )
      ).toEqual(null);
    });

    it('should return true when value contain less than 66 characters followed by 0x', () => {
      expect(
        getFormErrors('0x' + '123', HexValidators.isPublicKeyValid)
      ).toEqual({ isHexInvalid: true });
    });

    it('should return null when value start with 0x and is followed by 130 characters', () => {
      expect(
        getFormErrors(
          '0x' + hexWithoutBeginning130,
          HexValidators.isPublicKeyValid
        )
      ).toEqual(null);
    });

    it('should return true when value start with 0x and is followed by 67 characters', () => {
      expect(
        getFormErrors('0x1' + '123', HexValidators.isPublicKeyValid)
      ).toEqual({ isHexInvalid: true });
    });

    it('should return true when value start with 0x and is followed by 131 characters', () => {
      expect(
        getFormErrors(
          '0x1' + hexWithoutBeginning130,
          HexValidators.isPublicKeyValid
        )
      ).toEqual({ isHexInvalid: true });
    });

    it('should return true when value start with different value but is followed by proper hex', () => {
      expect(
        getFormErrors(
          'Abc0x' + hexWithoutBeginning66,
          HexValidators.isPublicKeyValid
        )
      ).toEqual({ isHexInvalid: true });
    });
  });

  describe('tests for isEthrAddressValid', () => {
    it('should return error when passing wrong ethereum address', () => {
      expect(getFormErrors('0x' + '123', HexValidators.isEthAddress)).toEqual({
        isHexInvalid: true,
      });
    });

    it('should pass when passing valid ethereum address', () => {
      expect(
        getFormErrors('0x' + stringWithLength(40), HexValidators.isEthAddress)
      ).toEqual(null);
    });
  });

  describe('tests for valid did', () => {
    it('should return null if value is undefined', () => {
      expect(getFormErrors(undefined, HexValidators.isDidValid)).toEqual(null);
    });

    it('should return invalidDid when did do not contains did prefix', () => {
      expect(
        getFormErrors('0x' + stringWithLength(40), HexValidators.isDidValid)
      ).toEqual({
        invalidDid: true,
      });
    });

    it('should return invalidDid when passed value do not have colon after did', () => {
      expect(
        getFormErrors(
          'didethr:' + stringWithLength(40),
          HexValidators.isDidValid
        )
      ).toEqual({
        invalidDid: true,
      });
    });

    it('should return invalidDid when passed value do not have specified did method', () => {
      expect(
        getFormErrors('did:' + stringWithLength(40), HexValidators.isDidValid)
      ).toEqual({
        invalidDid: true,
      });
    });

    it('should return invalidDid when ethereum address do not contains 0x', () => {
      expect(
        getFormErrors(
          'did:ethr:' + stringWithLength(40),
          HexValidators.isDidValid
        )
      ).toEqual({
        invalidDid: true,
      });
    });

    it('should return invalidDid when ethereum address contains less than 40 characters after 0x', () => {
      expect(
        getFormErrors(
          'did:ethr:0x' + stringWithLength(39),
          HexValidators.isDidValid
        )
      ).toEqual({
        invalidDid: true,
      });
    });

    it('should return invalidDid when ethereum address contains more than 40 characters after 0x', () => {
      expect(
        getFormErrors(
          'did:ethr:0x' + stringWithLength(41),
          HexValidators.isDidValid
        )
      ).toEqual({
        invalidDid: true,
      });
    });

    it('should return null when did is valid', () => {
      expect(
        getFormErrors(
          'did:ethr:0x' + stringWithLength(40),
          HexValidators.isDidValid
        )
      ).toEqual(null);
    });

    it('should return null when did have method and method specified id', () => {
      expect(
        getFormErrors(
          'did:ethr:chainid:0x' + stringWithLength(40),
          HexValidators.isDidValid
        )
      ).toEqual(null);
    });
  });
});

const getFormErrors = (value: string, validator: () => ValidatorFn) => {
  return new FormControl(value, [validator()]).errors;
};
