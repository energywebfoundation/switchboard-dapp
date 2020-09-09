import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

const swal = require('sweetalert');

const createFormGroupRegister = dataItem => new FormGroup({
    'organizationType': new FormControl(dataItem.organizationType, Validators.required),
    'name': new FormControl(dataItem.name, Validators.required),
    'postalAddress': new FormControl(dataItem.postalAddress, Validators.required),
    'meteringAddress': new FormControl(dataItem.meteringAddress, Validators.required),
    'did': new FormControl(dataItem.did),
});

@Component({
    selector: 'app-asset-owner',
    templateUrl: './asset-owner.component.html',
    styleUrls: ['./asset-owner.component.scss']
})
export class AssetOwnerComponent implements OnInit {
    public formGroupRegister: FormGroup;

    constructor(
        private authenticationService: AuthService,
        private router: Router,
        private spinner: NgxSpinnerService,
        private route: ActivatedRoute) {
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
        });
    }

    onFormRegisterSubmit(): void {
        console.log("onFormRegisterSubmit");
        if (!this.formGroupRegister.invalid) {
            this.spinner.show();
            this.formGroupRegister.value.did = this.authenticationService.getDID();
            this.authenticationService.setUser(JSON.stringify(this.formGroupRegister.value)).then(() => {
                this.spinner.hide();
                this.router.navigate(['/']).then(() => {
                    swal("Successfully Register", "", "success");
                });
            });
        }
    }
}

