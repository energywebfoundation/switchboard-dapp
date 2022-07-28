import { TimeDurationPipe } from 'src/app/shared/pipes/time-duration/time-duration.pipe';
export const formatValidityPeriod = (num: number): string => {
  const timePipe = new TimeDurationPipe();
  return num ? timePipe.transform(num) : null;
};
