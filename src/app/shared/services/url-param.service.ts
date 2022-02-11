import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UrlParamService {
  updateQueryParams(
    router: Router,
    activatedRoute: ActivatedRoute,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryParams: any,
    paramListToRemove?: string[]
  ) {
    if (paramListToRemove) {
      let params = JSON.parse(
        JSON.stringify(activatedRoute.snapshot.queryParams)
      );
      paramListToRemove.forEach((item) => {
        delete params[item];
      });

      params = {
        ...params,
        ...queryParams,
      };

      router.navigate([], {
        relativeTo: activatedRoute,
        queryParams: params,
      });
    } else {
      router.navigate([], {
        relativeTo: activatedRoute,
        queryParams,
        queryParamsHandling: 'merge',
      });
    }
  }
}
