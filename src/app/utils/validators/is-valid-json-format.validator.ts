import { AbstractControl } from '@angular/forms';

export const isValidJsonFormatValidator = (jsonFormatCtrl: AbstractControl): { [key: string]: boolean } | null => {
  let retVal = null;
  const jsonStr = jsonFormatCtrl.value;

  if (jsonStr && jsonStr.trim()) {
    try {
      JSON.parse(jsonStr);
    } catch (e) {
      retVal = {invalidJsonFormat: true};
    }
  }

  return retVal;
}
