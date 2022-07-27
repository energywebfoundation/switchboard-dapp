export const formatValidityPeriod = (num: number): string => {
  if (!num) {
    return null;
  }
  const seconds = Math.floor(num % 60);
  const minutes = Math.floor((num % 3600) / 60);
  const hours = Math.floor((num % (3600 * 24)) / 3600);
  const days = Math.floor(num / (3600 * 24));

  const unitTimesFormatted = {
    0: {
      singular: 'day',
      plural: 'days',
    },
    1: {
      singular: 'hour',
      plural: 'hours',
    },
    2: {
      singular: 'minute',
      plural: 'minutes',
    },
    3: {
      singular: 'second',
      plural: 'seconds',
    },
  };

  const unitsOfTime = [days, hours, minutes, seconds];
  const timeFormatted = unitsOfTime
    .map((val, i) => {
      if (val && val !== 0) {
        return `${val} ${
          val > 1
            ? unitTimesFormatted[i]['plural']
            : unitTimesFormatted[i]['singular']
        }`;
      }
    })
    .filter((val) => val);
  return timeFormatted.join(', ');
};
