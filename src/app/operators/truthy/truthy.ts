import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export function truthy<T>() {
  return (source: Observable<T>) => {
    return source.pipe(filter((v) => !!v));
  };
}
