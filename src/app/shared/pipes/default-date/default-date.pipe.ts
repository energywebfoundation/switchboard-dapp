import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'defaultDate',
})
export class DefaultDatePipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}
  transform(value: Date | number | string, ...options: string[]): string {
    return this.datePipe.transform(value, 'MM/dd/yyyy HH:mm:ss', ...options);
  }
}
