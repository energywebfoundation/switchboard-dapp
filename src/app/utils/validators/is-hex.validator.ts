import { AbstractControl } from '@angular/forms';

const hexRegex = new RegExp('^(0x)([0-9a-fA-F])');

// 0x + 66
const SHORT_HEX = 68;
// 0x + 130
const LONG_HEX = 132;

export function isHexValidator(control: AbstractControl) {
  if (!control.value) {
    return null;
  }
  const validLength = control.value.length === SHORT_HEX || control.value.length === LONG_HEX;
  if (hexRegex.test(control.value) && validLength) {
    return null;
  }
  return {
    isHexInvalid: true
  };

}
