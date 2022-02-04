import { AbstractControl } from '@angular/forms';

const alphaNumericRegex = new RegExp(/^[a-z0-9]+$/i);

export function isAlphanumericValidator(control: AbstractControl) {
  if (!control.value) {
    return null;
  }
  if (alphaNumericRegex.test(control.value)) {
    return null;
  }
  return {
    isAlphaNumericInvalid: true,
  };
}
