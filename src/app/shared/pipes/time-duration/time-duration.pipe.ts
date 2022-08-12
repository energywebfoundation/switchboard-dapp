import { Pipe, PipeTransform } from '@angular/core';
import { ParseTimestampResult, Timestamp } from './timestamp';

@Pipe({
  name: 'timeDuration',
})
export class TimeDurationPipe implements PipeTransform {
  private readonly defaultText = '---';

  transform(value: ParseTimestampResult | number): string {
    if (!value || +value < 0) {
      return this.defaultText;
    }
    if (typeof value === 'number') {
      return this.createMessage(
        new Timestamp().determineFromMiliseconds(value)
      );
    }

    return this.createMessage(value);
  }

  private createMessage(value: ParseTimestampResult): string {
    const validValues = this.getValidValues(value);

    if (validValues.length === 0) {
      return this.defaultText;
    }

    if (validValues.length === 1) {
      return validValues.pop();
    }

    return `${validValues.slice(0, -1).join(', ')} and ${validValues.slice(
      -1
    )}`;
  }

  private getValidValues(value: ParseTimestampResult): string[] {
    const { years, days, hours, minutes, seconds } = value;
    return [
      this.mapToString(years, 'year'),
      this.mapToString(days, 'day'),
      this.mapToString(hours, 'hour'),
      this.mapToString(minutes, 'minute'),
      this.mapToString(seconds, 'second'),
    ].filter(Boolean);
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
}
