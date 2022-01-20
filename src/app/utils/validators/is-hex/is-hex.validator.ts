import { AbstractControl, ValidatorFn } from '@angular/forms';

const hexValues = '[0-9a-fA-F]';

const ethAddrPattern = `0x${hexValues}{40}`;
const DIDPattern = `^did:[a-z0-9]+:([a-z0-9]+:)?(${ethAddrPattern})$`;

export const hexRegex = new RegExp(`^(0x)(${hexValues})`);
export const didRegex = new RegExp(DIDPattern);

// 0x + 66
const SHORT_HEX = 68;
// 0x + 130
const LONG_HEX = 132;
// 0x + 40
const ETHEREUM_ADDRESS = 42;

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
        isHexInvalid: true,
      };
    };
  }

  static isPublicKeyValid() {
    return HexValidators.isHex([SHORT_HEX, LONG_HEX]);
  }

  static isEthAddress() {
    return HexValidators.isHex([ETHEREUM_ADDRESS]);
  }

  static isDidValid() {
    return (control: AbstractControl) => {
      if (!control.value) {
        return null;
      }

      if (didRegex.test(control.value.trim())) {
        return null;
      }

      return { invalidDid: true };
    };
  }
}

const isValidLength = (control: number, possibleLengths: number[]): boolean => {
  return possibleLengths.map((v) => v === control).some((v) => v === true);
};
