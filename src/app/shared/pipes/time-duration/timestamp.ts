export interface ParseTimestampResult {
  years: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export class Timestamp {
  private readonly year = 31536000;
  private readonly day = 86400;
  private readonly hour = 3600;
  private readonly minute = 60;

  determineFromSeconds(value: number): ParseTimestampResult {
    const years = this.getQuotient(value, this.year);
    const yearsReminder = this.getReminder(value, this.year);
    const days = this.getQuotient(yearsReminder, this.day);
    const daysReminder = this.getReminder(value, this.day);
    const hours = this.getQuotient(daysReminder, this.hour);
    const hoursReminder = this.getReminder(daysReminder, this.hour);
    const minutes = this.getQuotient(hoursReminder, this.minute);
    const seconds = this.getReminder(hoursReminder, this.minute) ?? 0;
    return { years, days, hours, minutes, seconds };
  }

  parseToSeconds(value: ParseTimestampResult): number {
    return (
      this.multiply(value.years, this.year) +
      this.multiply(value.days, this.day) +
      this.multiply(value.hours, this.hour) +
      this.multiply(value.minutes, this.minute) +
      this.multiply(value.seconds, 1)
    );
  }

  private multiply(value: number, multiplier: number) {
    if (value) {
      return value * multiplier;
    }

    return 0;
  }

  private getQuotient(value: number, divider: number): number {
    return Math.floor(value / divider);
  }

  private getReminder(value: number, divider: number): number {
    return value % divider;
  }
}
