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
      expect(getFormErrors(undefined, HexValidators.isPublicKeyValid)).toEqual(null);
    });

    it('should return null when passing empty string', () => {
      expect(getFormErrors('', HexValidators.isPublicKeyValid)).toEqual(null);
    });

    it('should return true when value do not start with 0x', () => {
      expect(getFormErrors('a' + hexWithoutBeginning66, HexValidators.isPublicKeyValid)).toEqual({isHexInvalid: true});
    });

    it('should return null when value start with 0x and is followed by 66 characters', () => {
      expect(getFormErrors('0x' + hexWithoutBeginning66, HexValidators.isPublicKeyValid)).toEqual(null);
    });

    it('should return true when value contain less than 66 characters followed by 0x', () => {
      expect(getFormErrors('0x' + '123', HexValidators.isPublicKeyValid)).toEqual({isHexInvalid: true});
    });


    it('should return null when value start with 0x and is followed by 130 characters', () => {
      expect(getFormErrors('0x' + hexWithoutBeginning130, HexValidators.isPublicKeyValid)).toEqual(null);
    });

    it('should return true when value start with 0x and is followed by 67 characters', () => {
      expect(getFormErrors('0x1' + '123', HexValidators.isPublicKeyValid)).toEqual({isHexInvalid: true});
    });

    it('should return true when value start with 0x and is followed by 131 characters', () => {
      expect(getFormErrors('0x1' + hexWithoutBeginning130, HexValidators.isPublicKeyValid)).toEqual({isHexInvalid: true});
    });

    it('should return true when value start with different value but is followed by proper hex', () => {
      expect(getFormErrors('Abc0x' + hexWithoutBeginning66, HexValidators.isPublicKeyValid)).toEqual({isHexInvalid: true});
    });


  });

  describe('tests for isEthrAddressValid', () => {
    it('should return error when passing wrong ethereum address', () => {
      expect(getFormErrors('0x' + '123', HexValidators.isEthAddress)).toEqual({isHexInvalid: true});
    });

    it('should pass when passing valid ethereum address', () => {
      expect(getFormErrors('0x' + stringWithLength(40), HexValidators.isEthAddress)).toEqual(null);
    });
  });
});


const getFormErrors = (value: string, validator: () => ValidatorFn) => {
  return new FormControl(value, [validator()]).errors;
};
