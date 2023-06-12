import { Pipe, PipeTransform } from '@angular/core';
import { JsonPipe } from '@angular/common';

@Pipe({
  name: 'parseFieldValue',
})
export class ParseFieldValuePipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
      return new JsonPipe().transform(value);
    }
    return value;
  }
}
