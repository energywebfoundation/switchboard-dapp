import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FieldValidationService {
  /**
   * Checks if the number range is valid.
   *
   * @param { Number } from lower value
   * @param { Number } to higher value
   *
   * @returns { Boolean } true if valid; false otherwise
   */
  numberRangeValid(from: number | undefined, to: number | undefined): boolean {
    let retVal = true;

    if (from !== undefined && to !== undefined && from > to) {
      retVal = false;
    }

    return retVal;
  }

  autoRangeControls(from: AbstractControl, to: AbstractControl) {
    if (from && to) {
      from.valueChanges
        .pipe(
          filter(
            (v) =>
              to.value !== undefined &&
              to.value !== null &&
              from.value !== undefined &&
              from.value !== null &&
              v > to.value
          )
        )
        .subscribe((v) => to.setValue(v));

      to.valueChanges
        .pipe(
          filter(
            (v) =>
              from.value !== undefined &&
              from.value !== null &&
              to.value !== undefined &&
              to.value !== null &&
              to.value &&
              v < from.value
          )
        )
        .subscribe((v) => from.setValue(v));
    }
  }
}
