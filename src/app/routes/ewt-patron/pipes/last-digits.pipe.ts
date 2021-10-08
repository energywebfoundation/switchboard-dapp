import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lastDigits'
})
export class LastDigitsPipe implements PipeTransform {

  transform(value: string | undefined | null, numberOfDigits: number = 3, ...args: unknown[]): unknown {
    if (!value) {
      return value;
    }

    const [integerNumber, fractional] = value.split('.');
    if (fractional) {
      return integerNumber + '.' + fractional.substring(0, numberOfDigits);
    }
    return integerNumber;
  }

}
