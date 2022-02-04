import { Observable } from 'rxjs';
import { delay, map, retryWhen } from 'rxjs/operators';

interface IRetryWhenWithDelay {
  maxRetries?: number;
  delayDuration?: number;
}

export const retryWhenWithDelay = ({
  maxRetries = 5,
  delayDuration = 2000,
}: IRetryWhenWithDelay = {}) => {
  return (source: Observable<unknown>) => {
    return source.pipe(
      retryWhen((errors) => {
        let retries = 0;
        return errors.pipe(
          delay(delayDuration),
          map((error) => {
            if (retries++ === maxRetries) {
              throw error;
            }
            return error;
          })
        );
      })
    );
  };
};
