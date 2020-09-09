import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUser();
        console.log(currentUser);
        if (currentUser) {
            // logged in so return true
            // this.router.navigate(['dashboard/' + currentUser.organizationType]);
            return true;
        }
        
        // not logged in so redirect to login page with the return url
        this.router.navigate(['registration/register'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
