import { from } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function filterAsync(predicate: (elem: any) => Promise<boolean>) {
  return mergeMap((e) =>
    from(predicate(e)).pipe(
      filter((b) => b),
      map(() => e)
    )
  );
}
