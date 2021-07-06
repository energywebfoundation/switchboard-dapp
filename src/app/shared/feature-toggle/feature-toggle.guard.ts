import { Inject, Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FEAT_TOGGLE_TOKEN } from './feature-toggle.token';
import { FeatureToggle } from './feature-toggle.interface';

@Injectable({
  providedIn: 'root'
})
export class FeatureToggleGuard implements CanActivate {

  constructor(@Inject(FEAT_TOGGLE_TOKEN) private featureToggle: FeatureToggle) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.featureToggle.featureVisible;
  }
}
