import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { IamService } from './iam.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private iamService: IamService
    ) { }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.iamService.iam.isSessionActive()) {
            if (state.url === 'welcome') {
                this.router.navigate(['dashboard']);
            }
            else if (!state.url.startsWith('/dashboard')) {
                this.router.navigate(['dashboard'], { queryParams: { returnUrl: state.url } });
            }
            return true;
        }

        // not logged in so redirect to login page with the return url
        // this.router.navigate(['welcome'], { queryParams: { returnUrl: state.url } });
        this.router.navigate(['welcome']);
        return false;
    }
}
