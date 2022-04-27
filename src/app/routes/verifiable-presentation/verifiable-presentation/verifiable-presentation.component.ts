import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IamService } from "../../../shared/services/iam.service";
import { LoadingService } from '../../../shared/services/loading.service';
import { ConnectToWalletDialogComponent } from '../../../modules/connect-to-wallet/connect-to-wallet-dialog/connect-to-wallet-dialog.component';
import { LoginService } from 'src/app/shared/services/login/login.service';
import { AuthActions } from '@state';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { isUserLoggedIn } from '../../../state/auth/auth.selectors';
@Component({
    selector: 'app-verifiable-presentation',
    templateUrl: './verifiable-presentation.component.html',
    styleUrls: ['./verifiable-presentation.component.scss']
})
export class VerifiablePresentationComponent implements OnInit {
    oob$: Observable<string>
    public isLoggedIn = false;
    constructor(
        private route: ActivatedRoute,
        private loadingService: LoadingService,
        private loginService: LoginService,
        private store: Store,
        public dialog: MatDialog,
        private iamService: IamService
    ) { }
    isAutolistLoading = {
        requests: [],
        value: false,
    };
    ngOnInit(): void {
        this._initSearch()

    }
    private _initSearch() {
        this.route.queryParams.subscribe(async (params: any) => {
            //this.loadingService.show()
            await this.initLoginUser();
            if (params._oob) {
                const paramsDecoded = atob(params._oob);
                const parsedToObj = JSON.parse(paramsDecoded)
                const { url } = parsedToObj;
                /*
                TO DO: Call ICL when persistence of pres def is implemented:
                    try {
                    await this.iamService.verifiableCredentialsService.initiateExchange({type: 'https://energyweb.org/out-of-band-invitation/vc-api-exchange', url: url})
                    this.loadingService.hide();
                } catch (e) {
                    console.log(e)
                } finally {
                    this.loadingService.hide();
                }
                 */
                
            }
        });
    }
    private async initLoginUser() {
        // Check Login
        if (this.loginService.isSessionActive()) {
            this.store.dispatch(AuthActions.reinitializeAuthForEnrol());
            // Set Loggedin Flag to true
            this.isLoggedIn = await this.store
                .select(isUserLoggedIn)
                .pipe(filter<boolean>(Boolean), take(1))
                .toPromise();
        } else {
            this.loadingService.hide();
            // Launch Login Dialog
            await this.dialog
                .open(ConnectToWalletDialogComponent, {
                    width: '434px',
                    panelClass: 'connect-to-wallet',
                    maxWidth: '100%',
                    disableClose: true,
                })
                .afterClosed()
                .toPromise();

            // Set Loggedin Flag to true
            this.isLoggedIn = true;
            this.loadingService.show();
        }
    }

}
