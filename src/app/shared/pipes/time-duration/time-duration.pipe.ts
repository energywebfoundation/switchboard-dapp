import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeDuration',
})
export class TimeDurationPipe implements PipeTransform {
  private readonly year = 31536000;
  private readonly day = 86400;
  private readonly hour = 3600;
  private readonly minute = 60;

  transform(value: string | number): unknown {
    if (!value || +value < 0) {
      return '---';
    }

    return this.createMessage(+value);
  }

  private createMessage(value: number): string {
    const years = this.getQuotient(value, this.year);
    const yearsReminder = this.getReminder(value, this.year);
    const days = this.getQuotient(yearsReminder, this.day);
    const daysReminder = this.getReminder(value, this.day);
    const hours = this.getQuotient(daysReminder, this.hour);
    const hoursReminder = this.getReminder(daysReminder, this.hour);
    const minutes = this.getQuotient(hoursReminder, this.minute);
    const seconds = this.getReminder(hoursReminder, this.minute) ?? 0;
    const validValues = [
      this.mapToString(years, 'year'),
      this.mapToString(days, 'day'),
      this.mapToString(hours, 'hour'),
      this.mapToString(minutes, 'minute'),
      this.mapToString(seconds, 'second'),
    ].filter(Boolean);

    if (validValues.length === 1) {
      return validValues.pop();
    }

    return `${validValues.slice(0, -1).join(', ')} and ${validValues.slice(
      -1
    )}`;
  }

  private mapToString(value: number, text: string): string {
    if (!value) {
      return undefined;
    }

    if (value >= 2) {
      return `${value} ${text}s`;
    }

    return `${value} ${text}`;
  }

  private getQuotient(value: number, divider: number): number {
    return Math.floor(value / divider);
  }

  private getReminder(value: number, divider: number): number {
    return value % divider;
  }
}
