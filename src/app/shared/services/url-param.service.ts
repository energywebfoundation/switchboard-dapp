import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UrlParamService {

  constructor() { }

  updateQueryParams(router: Router, activatedRoute: ActivatedRoute, queryParams: any, paramListToRemove?: string[]) {
    if (paramListToRemove) {
      let params = JSON.parse(JSON.stringify(activatedRoute.snapshot.queryParams));
      paramListToRemove.forEach((item) => {
        delete params[item];
      });

      params = {
        ...params,
        ...queryParams
      };
  
      router.navigate([], {
        relativeTo: activatedRoute,
        queryParams: params
      });
    }
    else {
      router.navigate([], {
        relativeTo: activatedRoute,
        queryParams,
        queryParamsHandling: 'merge'
      });
    }
  }

  removeQueryParams(router: Router, activatedRoute: ActivatedRoute, paramList: string[]) {

    
  }
}
