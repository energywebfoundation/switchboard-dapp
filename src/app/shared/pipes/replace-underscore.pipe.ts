import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceUnderscore',
})
export class ReplaceUnderscorePipe implements PipeTransform {
  transform(value: string, replaceWith = ' '): unknown {
    if (value == null) {
      return '';
    }
    return value.replace(/_/g, replaceWith);
  }
}
