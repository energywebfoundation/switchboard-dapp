import { AbstractControl } from '@angular/forms';

export function isHexValidator(control: AbstractControl) {
  if (!control.value) {
    return null;
  }
  const hexRegex = new RegExp('^(0x)([0-9a-fA-F])');
  // 0x + 66 = 68, 0x + 130 = 132.
  const validLength = control.value.length === 68 || control.value.length === 132;
  if (hexRegex.test(control.value) && validLength) {
    return null;
  }
  return {
    isHexInvalid: true
  };

}
