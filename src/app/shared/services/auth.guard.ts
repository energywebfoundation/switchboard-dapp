import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from './auth.service';
import { IamService, LoginType } from './iam.service';
import { LoadingService } from './loading.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthService,
        private iamService: IamService
    ) { }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let loginStatus = this.iamService.getLoginStatus();
        if (loginStatus) {
            if (state.url === 'welcome' || loginStatus === LoginType.LOCAL) {
                // console.log(state.url);
                if (state.url === 'welcome') {
                    this.router.navigate(['dashboard']);
                }
                else if (!state.url.startsWith('/dashboard')) {
                    this.router.navigate(['dashboard'], { queryParams: { returnUrl: state.url } });
                }
            }
            return true;
        }

        // not logged in so redirect to login page with the return url
        // this.router.navigate(['welcome'], { queryParams: { returnUrl: state.url } });
        this.router.navigate(['welcome']);
        return false;
    }
}
