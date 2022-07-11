import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeShift',
})
export class TimeShiftPipe implements PipeTransform {
  defaultDate = new Date(Date.now());

  transform(shift: number, dateValue?: string | Date): Date {
    const date = this.getDate(dateValue);
    date.setSeconds(date.getSeconds() + shift);
    return date;
  }

  private getDate(date: string | Date): Date {
    if (!date) {
      return this.defaultDate;
    }

    return new Date(date);
  }
}
