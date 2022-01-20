import { AbstractControl, ValidationErrors } from '@angular/forms';

export class ListValidator {
  static stringExist(source: string[]) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!source || source.length === 0) {
        return null;
      }
      if (!control.value) {
        return null;
      }

      const exist = source.some((did) => did === control.value);
      if (!exist) {
        return null;
      }
      return { exist: true };
    };
  }
}
