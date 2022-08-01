export interface ParseTimestampResult {
  years: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export class Timestamp {
  private readonly minute = 60;
  private readonly hour = this.minute * 60;
  private readonly day = this.hour * 24;
  private readonly year = this.day * 365;

  determineFromSeconds(value: number): ParseTimestampResult {
    const years = this.getQuotient(value, this.year);
    const yearsRemainder = this.getRemainder(value, this.year);
    const days = this.getQuotient(yearsRemainder, this.day);
    const daysRemainder = this.getRemainder(value, this.day);
    const hours = this.getQuotient(daysRemainder, this.hour);
    const hoursRemainder = this.getRemainder(daysRemainder, this.hour);
    const minutes = this.getQuotient(hoursRemainder, this.minute);
    const seconds = this.getRemainder(hoursRemainder, this.minute) ?? 0;
    return { years, days, hours, minutes, seconds };
  }

  parseToSeconds(value: ParseTimestampResult): number {
    if (Object.values(value).every((val) => val === 0)) {
      return null;
    }
    return (
      this.multiply(value.years, this.year) +
      this.multiply(value.days, this.day) +
      this.multiply(value.hours, this.hour) +
      this.multiply(value.minutes, this.minute) +
      value.seconds
    );
  }

  parseToMilliseconds(value: ParseTimestampResult): number {
    const seconds = this.parseToSeconds(value);
    return seconds ? seconds * 1000 : null;
  }

  private multiply(multiplicand: number, multiplier: number) {
    if (multiplicand) {
      return multiplicand * multiplier;
    }

    return 0;
  }

  private getQuotient(dividend: number, divisor: number): number {
    return Math.floor(dividend / divisor);
  }

  private getRemainder(dividend: number, divisor: number): number {
    return Math.floor(dividend % divisor);
  }
}
