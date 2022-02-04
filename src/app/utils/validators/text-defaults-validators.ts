import { Validators } from '@angular/forms';

export const textDefaultsValidators = [
  Validators.required,
  Validators.minLength(3),
  Validators.maxLength(256),
];
