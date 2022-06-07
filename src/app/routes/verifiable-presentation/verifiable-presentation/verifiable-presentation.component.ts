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
import { VpRequestInteractService } from '@ew-did-registry/credentials-interface'
import { IPresentationDefinition, IVerifiableCredential, SubmissionRequirementMatch} from '@sphereon/pex';
import {ICredentialTableData} from "../models/credential-table-data.interface"
@Component({
  selector: 'app-verifiable-presentation',
  templateUrl: './verifiable-presentation.component.html',
  styleUrls: ['./verifiable-presentation.component.scss'],
})
export class VerifiablePresentationComponent implements OnInit {
  oob$: Observable<string>;
  tableData: MatTableDataSource<ICredentialTableData>;
  requiredRedentials: { [key: string]: IVerifiableCredential };
  challenge: string;
  interact: {
    service: VpRequestInteractService[]
  };
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
    this._initPresentationFetch();
  }
  _initPresentationFetch() {
    this.route.queryParams.subscribe(async (params: {_oob?: string}) => {
      await this.initLoginUser();
      if (params._oob) {
        const paramsDecoded = atob(params._oob);
        const parsedToObj = JSON.parse(paramsDecoded);
        console.log(JSON.stringify(parsedToObj), "THE PARAMS!!!")
        const { url } = parsedToObj;
        /*
         TO DO:
         - Error handling - no url parsed
         - UI Handling - no results found from initiate exchange
        */
        console.log(url);
        const result = await this.iamService.verifiableCredentialsService.initiateExchange({ type: 'https://energyweb.org/out-of-band-invitation/vc-api-exchange', url });
        console.log(JSON.stringify(result), "CREDENTIAL RESULT FROM ICL");
        const presDef: IPresentationDefinition = result?.vpRequest?.query[0]?.credentialQuery[0]?.presentationDefinition as IPresentationDefinition
        this.challenge = result?.vpRequest?.challenge;
        this.interact = result?.vpRequest?.interact
        this.setRequiredCredentials(presDef)
        this.tableData = new MatTableDataSource(this.formatTableData(result));
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
      return Object.values(this.requiredRedentials).some(x => x === null)
    } else {
      return true;
    }
  }

  formatTableData(request): ICredentialTableData[] {
    const inputDescriptors = request?.vpRequest?.query[0]?.credentialQuery[0]?.presentationDefinition?.input_descriptors;
    const selectResults = request?.selections[0]?.selectResults;
    // If the input descriptor is self-sign:
     const descriptors = inputDescriptors.map(desc => {
      if (desc.constraints?.subject_is_issuer === "required") {
        return { descriptor: desc.name, selfSign: true, descId: desc.id }
      }
    // If the input descriptor contains a matching credential(s) to select from:
      /* 
      Get indeces of matched credentials from path:
         "path": [
            "$.credentialSubject.chargingData.contractDID"
          ]
      */
      const descriptorMatches: number[] = selectResults?.matches?.filter((match: SubmissionRequirementMatch) => match.name === desc.name).map(res => {
        const regexMatch = res.vc_path?.map((path: string) => path.match(/\d+/)).map(mtch => parseInt(mtch[0]))
        return regexMatch[0]
      })
      console.log(descriptorMatches, "THE DESCRIPTOR MATCHES")
       const allMatchedCredentials = [];
        // Select credential at each index
      descriptorMatches.forEach((match: number) => {
        allMatchedCredentials.push({role: selectResults?.verifiableCredential[match]?.credentialSubject?.role?.namespace, credential: selectResults?.verifiableCredential[match], descriptor: desc.id})
      });
        // Create table data with descriptor name and all matched credentials. 
      return { descriptor: desc.name, credentials: allMatchedCredentials, selfSign: false, descId: desc.id };
    });
    console.log(JSON.stringify(descriptors), "THE DESCRIPTORS")
    return descriptors;
  }

 setRequiredCredentials(presDef: IPresentationDefinition) {
    const reqCredentials = {};
    presDef?.input_descriptors.forEach(desc => {
      reqCredentials[desc.id] = null;
    });
    this.requiredRedentials = reqCredentials;
  }
}
