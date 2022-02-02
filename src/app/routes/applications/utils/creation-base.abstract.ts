import { AbstractControl } from '@angular/forms';
import { StringTransform } from '@utils';

export abstract class CreationBaseAbstract {
  parseValue(form: AbstractControl, value: string): void {
    form.patchValue(StringTransform.removeWhiteSpaces(value.toLowerCase()), {
      emitEvent: false,
    });
  }
}
