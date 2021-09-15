import { AbstractControl, ValidatorFn } from '@angular/forms';

const hexRegex = new RegExp('^(0x)([0-9a-fA-F])');

// 0x + 66
const SHORT_HEX = 68;
// 0x + 130
const LONG_HEX = 132;
// 0x + 40
const ETHEREUM_ADDRESS = 42;

export class HexValidators {
  static isHexValidator(possibleLengths: number[]): ValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) {
        return null;
      }
      const validLength = isValidLength(control.value.length, possibleLengths);
      if (hexRegex.test(control.value) && validLength) {
        return null;
      }
      return {
        isHexInvalid: true
      };
    };
  };

  static isPublicKeyValidValidator() {
    return this.isHexValidator([SHORT_HEX, LONG_HEX]);
  };

  static isEthAddressValidator() {
    return this.isHexValidator([ETHEREUM_ADDRESS]);
  };
}

const isValidLength = (control: number, possibleLengths: number[]): boolean => {
  return possibleLengths.map(v => v === control).some(v => v === true);
};
