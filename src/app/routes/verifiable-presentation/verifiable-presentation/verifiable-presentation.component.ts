import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IamService } from "../../../shared/services/iam.service";
import { IOOBPresentation } from '../models/out-of-band-presentation.interface';
import { LoadingService } from '../../../shared/services/loading.service';
import { ConnectToWalletDialogComponent } from '../../../modules/connect-to-wallet/connect-to-wallet-dialog/connect-to-wallet-dialog.component';
import { LoginService } from 'src/app/shared/services/login/login.service';
import { AuthActions} from '@state';
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

        // async getCredentialsByPresentationDefinition(
        //     definition: PresentationDefinition
        //   ): Promise<SelectResults> {
        //     const { data } = await this._http.post<SelectResults>(
        //       `/vp/match`,
        //       definition
        //     );
 
    private _initSearch() {
        this.route.queryParams.subscribe(async (params: any) => {
            this.loadingService.show()
            await this.initLoginUser();
            if (params._oob) {
                const paramsDecoded = atob(params._oob);
                const parsedToObj = JSON.parse(paramsDecoded)
                console.log(parsedToObj, "THE OBJECT PARSED");
                this.iamService.verifiableCredentialsService.initiateExchange({type: "ExchangeInvitation", url: })
                this.loadingService.hide();
                //Send decoded params to IAM client lib
            }
          this.loadingService.hide();
        })
    }
    private async initLoginUser() {
        // Check Login
        if (this.loginService.isSessionActive()) {
            console.log("GETING HERE TO IS ACTIVE")
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
