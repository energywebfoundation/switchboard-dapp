import { AbstractControl } from '@angular/forms';

const URL_PATTERN = 'https?://.*';
const urlRegex = new RegExp(URL_PATTERN);

export const isUrlValidator = () => {
  return (control: AbstractControl) => {
    if (!control.value) {
      return null;
    }
    if (urlRegex.test(control.value)) {
      return null;
    }
    return { invalidUrl: true };
  };
};
