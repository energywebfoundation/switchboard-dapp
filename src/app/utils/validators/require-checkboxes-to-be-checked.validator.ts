import { FormGroup, ValidatorFn } from '@angular/forms';

export const requireCheckboxesToBeCheckedValidator = (
  minRequired = 1
): ValidatorFn => {
  return (formGroup: FormGroup) => {
    const checkboxCheckedAmount = Object.keys(formGroup.controls).filter(
      (key) => formGroup.controls[key].value
    ).length;

    if (checkboxCheckedAmount < minRequired) {
      return {
        notEnoughCheckboxChecked: true,
      };
    }

    return null;
  };
};
