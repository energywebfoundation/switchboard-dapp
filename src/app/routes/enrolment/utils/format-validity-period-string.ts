export const formatValidityPeriod = (num: number): string => {
  if (!num) {
    return null;
  }

  enum UnitsOfTime {
    YEAR = 'year',
    YEARS = 'years',
    DAY = 'day',
    DAYS = 'days',
    HOUR = 'hour',
    HOURS = 'hours',
    MINUTE = 'minute',
    MINUTES = 'minutes',
    SECOND = 'second',
    SECONDS = 'seconds',
  }

  const years = {
    value: Math.floor(num / (3600 * 24 * 365)),
    singular: UnitsOfTime.YEAR,
    plural: UnitsOfTime.YEARS,
  };
  const days = {
    value: years.value
      ? Math.floor(Math.floor(num / (3600 * 24)) / (365 * years.value))
      : Math.floor(num / (3600 * 24)),
    singular: UnitsOfTime.DAY,
    plural: UnitsOfTime.DAYS,
  };

  const hours = {
    value: Math.floor((num % (3600 * 24)) / 3600),
    singular: UnitsOfTime.HOUR,
    plural: UnitsOfTime.HOURS,
  };

  const minutes = {
    value: Math.floor((num % 3600) / 60),
    singular: UnitsOfTime.MINUTE,
    plural: UnitsOfTime.MINUTES,
  };

  const seconds = {
    value: Math.floor(num % 60),
    singular: UnitsOfTime.SECOND,
    plural: UnitsOfTime.SECONDS,
  };
  const unitsOfTime = [years, days, hours, minutes, seconds];
  const timeFormatted = unitsOfTime
    .map((timePeriod) => {
      if (timePeriod.value && timePeriod.value !== 0) {
        return `${timePeriod.value} ${
          timePeriod.value > 1 ? timePeriod.plural : timePeriod.singular
        }`;
      }
    })
    .filter((val) => val);
  return timeFormatted.join(', ');
};
