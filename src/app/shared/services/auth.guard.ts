import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { LoginService } from './login/login.service';
import { RouterConst } from '../../routes/router-const';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private loginService: LoginService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.loginService.isSessionActive()) {
      if (state.url === RouterConst.Welcome) {
        this.router.navigate([RouterConst.Dashboard]);
      } else if (!state.url.startsWith(`/${RouterConst.Dashboard}`)) {
        this.router.navigate([RouterConst.Dashboard], {
          queryParams: { returnUrl: state.url },
        });
      }
      return true;
    }

    this.router.navigate([RouterConst.Welcome]);
    return false;
  }
}
