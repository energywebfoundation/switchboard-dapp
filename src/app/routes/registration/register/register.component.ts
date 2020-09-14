import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';

const createFormGroupRegister = dataItem => new FormGroup({
  'organizationType': new FormControl(dataItem.organizationType, Validators.required)
});

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public formGroupRegister: FormGroup;
  public flexNode = "";
  constructor(
    private authenticationService: AuthService,
    private router: Router,
    public dialog: MatDialog,
    private http: HttpClient,
    private spinner: NgxSpinnerService,
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUser()) {
      this.router.navigate(['/']);
    }

    this.http.get('assets/flexhub/flexnode.json').toPromise().then((data: any) => {
      this.flexNode = data.NODENAME;
    });
  }

  openDialogSignInQr(): void {
    const dialogRef = this.dialog.open(SignInQr, {
      width: '780px', data: {},
      maxWidth: '95vw'
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result && result.privateKey) {
        this.spinner.show();
        await this.authenticationService.setUser(JSON.stringify(result.currentUser));
        this.spinner.hide();
        this.router.navigate(['/']);
      }
    });
  }

  onFormRegisterSubmit(): void {
    console.log("onFormRegisterSubmit");
    if (!this.formGroupRegister.invalid) {
      console.log(JSON.stringify(this.formGroupRegister.value));    
      this.router.navigate([this.formGroupRegister.value.organizationType.toLowerCase()], { queryParams: { organizationType: this.formGroupRegister.value.organizationType } }).then(() => {
        // window.location.reload();
      });
    }
  }

  ngOnInit() {
    this.formGroupRegister = createFormGroupRegister({});
  }

}

export interface DialogData {
  scanQR: string;
}

@Component({
  selector: 'sign-in-qr',
  templateUrl: 'sign-in-qr.html',
  styleUrls: ['./register.component.scss']
})

export class SignInQr {
  constructor(
    public dialogRef: MatDialogRef<SignInQr>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public qrResult: any = {};

  clearResult(): void {
    this.qrResult = null;
  }

  onCodeResult(resultString: string) {
    this.qrResult = JSON.parse(resultString);
    if (this.qrResult) {
      if (this.qrResult.privateKey && this.qrResult.currentUser) {
        this.dialogRef.close(this.qrResult);
      }
    }
  }
}
