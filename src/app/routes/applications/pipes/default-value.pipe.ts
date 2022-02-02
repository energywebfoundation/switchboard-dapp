import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'defaultValue',
})
export class DefaultValuePipe implements PipeTransform {
  transform(
    value: string | Record<string, unknown>
  ): string | Record<string, unknown> {
    return value ? value : 'None';
  }
}
