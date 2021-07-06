import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceUnderscore'
})
export class ReplaceUnderscorePipe implements PipeTransform {

  transform(value: string, replaceWith: string = ' ', ...args: unknown[]): unknown {
    if (value == null) {
      return '';
    }
    return value.replace(/_/g, replaceWith);
  }

}
