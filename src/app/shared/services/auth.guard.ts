import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from './auth.service';
import { IamService } from './iam.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthService,
        private iamService: IamService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUser();
        console.log('currentUser', currentUser);
        
        if (this.iamService.iam.isLoggedIn()) {
            if (state.url === 'welcome') {
                this.router.navigate(['dashboard']);
            }
            return true;
        }

        console.log('cannot activate yet', this.router);

        // not logged in so redirect to login page with the return url
        this.router.navigate(['welcome'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
