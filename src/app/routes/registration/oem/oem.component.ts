import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RegistrationService } from '../registration.service';
import { NgxSpinnerService } from 'ngx-spinner';

const swal = require('sweetalert');

const createFormGroupRegister = dataItem => new FormGroup({
    'organizationType': new FormControl(dataItem.organizationType, Validators.required),
    'name': new FormControl(dataItem.name, Validators.required),
    'emailAddress': new FormControl(dataItem.emailAddress, Validators.required),
    'postalAddress': new FormControl(dataItem.postalAddress, Validators.required)
});

@Component({
    selector: 'app-oem',
    templateUrl: './oem.component.html',
    styleUrls: ['./oem.component.scss']
})
export class OemComponent implements OnInit {
    public formGroupRegister: FormGroup;

    constructor(
        private registrationService: RegistrationService,
        private spinner: NgxSpinnerService,
        private authenticationService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUser()) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.route.queryParamMap.subscribe(params => {
            this.formGroupRegister = createFormGroupRegister({ organizationType: params.get('organizationType'), did: "" });
        });

    }

    onOrganizationType(ob) {
        let organizationType = ob.value;
        this.router.navigate([organizationType.toLowerCase()], { queryParams: { organizationType: organizationType } }).then(() => {
            // window.location.reload();
        });
    }

    onFormRegisterSubmit(): void {
        console.log("onFormRegisterSubmit");
        if (!this.formGroupRegister.invalid) {
            this.spinner.show();
            this.formGroupRegister.value.did = this.authenticationService.getDID();
            this.registrationService.registerUser(this.formGroupRegister.value)
                .then( (did: string) => {
                    if (did){
                        this.formGroupRegister.value.did = 'did:ethr:' + did;
                        this.authenticationService.setUser(JSON.stringify(this.formGroupRegister.value)).then(() => {
                            this.spinner.hide();
                            this.router.navigate(['/']).then(() => {
                                // window.location.reload();
                                swal("Successfully Register", "", "success");
                            });
                        });
                    } else {
                        this.spinner.hide();                        
                        swal("Unable to register your identity, already registered ?", "", "error");
                    }                   
                })
                .catch(error  => {
                    this.spinner.hide();
                    swal("Unable to register your identity, already registered ?", "", "error");
                });
        }
    }
}
