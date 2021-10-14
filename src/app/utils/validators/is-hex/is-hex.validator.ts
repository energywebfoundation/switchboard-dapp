import { AbstractControl, ValidatorFn } from '@angular/forms';

const hexRegex = new RegExp('^(0x)([0-9a-fA-F])');

// 0x + 66
const SHORT_HEX = 68;
// 0x + 130
const LONG_HEX = 132;
// 0x + 40
const ETHEREUM_ADDRESS = 42;

const ethAddrPattern = '0x[A-Fa-f0-9]{40}';
const DIDPattern = `^did:[a-z0-9]+:(${ethAddrPattern})$`;

export class HexValidators {
  static isHex(possibleLengths: number[]): ValidatorFn {
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

  static isPublicKeyValid() {
    return HexValidators.isHex([SHORT_HEX, LONG_HEX]);
  };

  static isEthAddress() {
    return HexValidators.isHex([ETHEREUM_ADDRESS]);
  };

  static isDidValid() {

    return (control: AbstractControl) => {
      let retVal = null;
      const did = control.value;

      if (did && !RegExp(DIDPattern).test(did.trim())) {
        retVal = {invalidDid: true};
      }

      return retVal;
    };
  }
}

const isValidLength = (control: number, possibleLengths: number[]): boolean => {
  return possibleLengths.map(v => v === control).some(v => v === true);
};
