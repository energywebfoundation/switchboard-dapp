import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { LoadingService } from '../../../shared/services/loading.service';
import { ConnectToWalletDialogComponent } from '../../../modules/connect-to-wallet/connect-to-wallet-dialog/connect-to-wallet-dialog.component';
import { LoginService } from 'src/app/shared/services/login/login.service';
import { AuthActions } from '@state';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { isUserLoggedIn } from '../../../state/auth/auth.selectors';
import { VpRequestInteractService } from '@ew-did-registry/credentials-interface';
import { IPresentationDefinition, IVerifiableCredential } from '@sphereon/pex';
import { ICredentialTableData } from '../models/credential-table-data.interface';
import { PresentationService } from '../services/presentation.service';
@Component({
  selector: 'app-verifiable-presentation',
  templateUrl: './verifiable-presentation.component.html',
  styleUrls: ['./verifiable-presentation.component.scss'],
})
export class VerifiablePresentationComponent implements OnInit {
  oob$: Observable<string>;
  tableData: ICredentialTableData[];
  requiredRedentials: { [key: string]: IVerifiableCredential };
  challenge: string;
  interact: {
    service: VpRequestInteractService[];
  };
  public isLoggedIn = false;
  constructor(
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private loginService: LoginService,
    private store: Store,
    public dialog: MatDialog,
    private presentationService: PresentationService
  ) {}
  isAutolistLoading = {
    requests: [],
    value: false,
  };
  ngOnInit(): void {
    this._initPresentationFetch();
  }
  _initPresentationFetch() {
    this.route.queryParams.subscribe(async (params: { _oob?: string }) => {
      await this.initLoginUser();
      if (params._oob) {
        const paramsDecoded = atob(params._oob);
        const parsedToObj = JSON.parse(paramsDecoded);
        const { url } = parsedToObj;
        /*
         TO DO:
         - Error handling - no url parsed
         - UI Handling - no results found from initiate exchange
        */
        console.log(url);
        await this.presentationService
          .fetchPresentation({
            type: 'https://energyweb.org/out-of-band-invitation/vc-api-exchange',
            url,
          })
          .subscribe((result) => {
            const presDef: IPresentationDefinition = result?.vpRequest?.query[0]
              ?.credentialQuery[0]
              ?.presentationDefinition as IPresentationDefinition;
            this.challenge = result?.vpRequest?.challenge;
            this.interact = result?.vpRequest?.interact;
            this.setRequiredCredentials(presDef);
            this.tableData = this.presentationService.formatPresentationTableData(result);
          });
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
  isSubmitFormButtonDisabled() {
    // only enable submit button if all required credentials from input descriptors have credential for submission:
    if (this.requiredRedentials) {
      return Object.values(this.requiredRedentials).some((x) => x === null);
    } else {
      return true;
    }
  }

  setRequiredCredentials(presDef: IPresentationDefinition) {
    const reqCredentials = {};
    presDef?.input_descriptors.forEach((desc) => {
      reqCredentials[desc.id] = null;
    });
    this.requiredRedentials = reqCredentials;
  }
}
