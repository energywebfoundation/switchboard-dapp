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
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-verifiable-presentation',
  templateUrl: './verifiable-presentation.component.html',
  styleUrls: ['./verifiable-presentation.component.scss'],
})
export class VerifiablePresentationComponent implements OnInit {
  oob$: Observable<string>;
  tableData$: any;
  presentationData$: any;
  submitDisabledForSelfSign$ = false;
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
        const result = await this.iamService.verifiableCredentialsService.initiateExchange({ type: 'https://energyweb.org/out-of-band-invitation/vc-api-exchange', url: 'https://vc-api-dev.energyweb.org/vc-api/exchanges/did:ethr:blxm-dev:0xCCa5fa8d744080eD0378cB739703ce53e9a56C00' });
        this.presentationData$ = result;
        // const result = await this.iamService.verifiableCredentialsService.initiateExchange({ type: 'https://energyweb.org/out-of-band-invitation/vc-api-exchange', url: "https://vc-api-dev.energyweb.org/vc-api/exchanges/did:ethr:blxm-dev:0xFBd3d99915bFcB8ad4EBf45773E4D0745F2c2F61" });
        console.log(JSON.stringify(result), "THE CREDENTIAL RESULT!!! RESULT!")

        // } catch (e) {
        //   console.log(e, "THE ERROR")
        // }
        const hasSelfSignedRequirement = result[0].presentationDefinition.input_descriptors.findIndex(desc => desc.constraints?.subject_is_issuer === "required")
        this.submitDisabledForSelfSign$ = hasSelfSignedRequirement > -1
        const dataFormatted = this.formatTableData(result);
        this.tableData$ = new MatTableDataSource(dataFormatted);
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

    const pres = data[0]
    // If the input descriptor is self-sign:
    const descriptors = pres.presentationDefinition?.input_descriptors.map(desc => {
      if (desc.constraints?.subject_is_issuer === "required") {
        return { descriptor: desc.name, selfSign: true }
      }
    // If the input descriptor contains a matching credential(s) to select from:
        //Get indeces of matched credentials:
      const descriptorMatches = pres.selectResults?.matches?.filter(match => match.name === desc.name).map(res => {
        const regexMatch = res.vc_path?.map(path => path.match(/\d+/)).map(mtch => parseInt(mtch[0]))
        return regexMatch[0]
      })
      const allMatchedCredentials = [];
        //Select credential name at each index
      descriptorMatches.forEach(match => {
        allMatchedCredentials.push({role: pres.selectResults?.verifiableCredential[match]?.credentialSubject?.role?.namespace, credential:pres.selectResults?.verifiableCredential[match]})
      });
        //create table data with descriptor name and all matched credentials. 
      return { descriptor: desc.name, credentials: allMatchedCredentials, selfSign: false };
    });
    return descriptors
  }
}
