import { FormControl, FormGroup } from '@angular/forms';
import { requireCheckboxesToBeCheckedValidator } from './require-checkboxes-to-be-checked.validator';

describe('tests for requireCheckboxesToBeCheckedValidator', () => {
  it('should return true when all checkboxes are unchecked.', () => {
    expect(
      requireCheckboxesToBeCheckedValidator()(
        new FormGroup({
          checkbox1: new FormControl(false),
          checkbox2: new FormControl(false),
        })
      )
    ).toEqual({ notEnoughCheckboxChecked: true });
  });

  it('should return null when all checkboxes are checked', () => {
    expect(
      requireCheckboxesToBeCheckedValidator()(
        new FormGroup({
          checkbox1: new FormControl(true),
          checkbox2: new FormControl(true),
        })
      )
    ).toEqual(null);
  });

  it('should return null when at least one checkbox is checked', () => {
    expect(
      requireCheckboxesToBeCheckedValidator()(
        new FormGroup({
          checkbox1: new FormControl(true),
          checkbox2: new FormControl(false),
        })
      )
    ).toEqual(null);
  });
});
