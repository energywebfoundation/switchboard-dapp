import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeShift',
})
export class TimeShiftPipe implements PipeTransform {
  defaultDate = new Date(Date.now());

  transform(shift: number, dateValue?: string | Date): Date {
    const date = this.getDate(dateValue);
    date.setMilliseconds(date.getMilliseconds() + shift);
    return date;
  }

  private getDate(date: string | Date): Date {
    if (!date) {
      return new Date(this.defaultDate);
    }

    return new Date(date);
  }
}
