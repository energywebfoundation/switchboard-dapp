import { AbstractControl } from '@angular/forms';

export const isValidJsonFormatValidator = (
  control: AbstractControl
): { [key: string]: boolean } | null => {
  const jsonStr = control.value;

  if (jsonStr && jsonStr.trim()) {
    try {
      JSON.parse(jsonStr);
    } catch (e) {
      return { invalidJsonFormat: true };
    }
  }

  return null;
};
