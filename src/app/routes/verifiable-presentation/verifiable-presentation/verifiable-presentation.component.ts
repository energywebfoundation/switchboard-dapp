import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IamService } from '../../../shared/services/iam.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { ConnectToWalletDialogComponent } from '../../../modules/connect-to-wallet/connect-to-wallet-dialog/connect-to-wallet-dialog.component';
import { LoginService } from 'src/app/shared/services/login/login.service';
import { AuthActions } from '@state';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { isUserLoggedIn } from '../../../state/auth/auth.selectors';
import { stringify } from 'querystring';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-verifiable-presentation',
  templateUrl: './verifiable-presentation.component.html',
  styleUrls: ['./verifiable-presentation.component.scss'],
})
export class VerifiablePresentationComponent implements OnInit {
  oob$: Observable<string>;
  tableData$: any;
  presentationData$: any
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
    this._initSearch();
  }
  private _initSearch() {
    this.route.queryParams.subscribe(async (params: any) => {
      //this.loadingService.show()
      await this.initLoginUser();
      if (params._oob) {
        const paramsDecoded = atob(params._oob);
        const parsedToObj = JSON.parse(paramsDecoded);
        console.log(parsedToObj, "THE PARAMS!!!")
        const { url } = parsedToObj;
        /*
         TO DO:
         - Error handling - no url parsed
         - UI Handling - no results found from initiate exchange
        */
        console.log(url);
        // let result
        // try {
         const  result = await this.iamService.verifiableCredentialsService.initiateExchange({ type: 'https://energyweb.org/out-of-band-invitation/vc-api-exchange', url: 'https://vc-api-dev.energyweb.org/vc-api/exchanges/did:ethr:blxm-dev:0xCCa5fa8d744080eD0378cB739703ce53e9a56C00'});
         this.presentationData$ = result;
         // const result = await this.iamService.verifiableCredentialsService.initiateExchange({ type: 'https://energyweb.org/out-of-band-invitation/vc-api-exchange', url: "https://vc-api-dev.energyweb.org/vc-api/exchanges/did:ethr:blxm-dev:0xFBd3d99915bFcB8ad4EBf45773E4D0745F2c2F61" });
         console.log(JSON.stringify(result), "THE CREDENTIAL RESULT!!! RESULT!")

        // } catch (e) {
        //   console.log(e, "THE ERROR")
        // }
        const {presentationDefinition, selectResults} = result[0];
        const credentialSelections = selectResults?.verifiableCredential?.map(cred => {
          const subject =  cred.credentialSubject as any;
          return subject.role.namespace
        });
        const dataFormatted = this.formatTableData(result)
        console.log(credentialSelections, "THE SELECTIONS!")
        this.tableData$ = new MatTableDataSource([
          { descriptor: 'Charging Data Agreement', selfSign: true },
          { descriptor: 'Customer Role Credential', selfSign: false, credentials: credentialSelections },
        ]);
      
      
    

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

  formatTableData(data) {
    const formattedData = data.map(pres => {
     const descriptors = pres.inputDescriptor.map(desc => desc.name)
     const matches = descriptors.map(desc => {
       const match =  pres.selectResults?.matches?.find(match => match.name === desc);
       const matchPath = match.vc_path[0];
       const pathWithIndex = matchPath.split(".")
       const pathIndexSplit = pathWithIndex.split("]");
      
    })
    });
   

  }

  
}
