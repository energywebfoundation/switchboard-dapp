import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { IamService } from 'src/app/shared/services/iam.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { CancelButton } from '../../loading/loading.component';

@Component({
    selector: 'dialog-user',
    templateUrl: 'dialog-user.component.html',
    styleUrls: ['../header.component.scss']
})
export class DialogUser implements OnInit {

    public profileForm      : FormGroup;
    public maxDate          : Date;

    constructor(
        public dialogRef: MatDialogRef<DialogUser>,
        private fb: FormBuilder,
        private iamService: IamService,
        private toastr: ToastrService,
        private loadingService: LoadingService) {
            this.profileForm = fb.group({
                name: ['', Validators.compose([
                    Validators.maxLength(256),
                    Validators.required
                ])],
                birthdate: ['', Validators.required],
                address: ['', Validators.compose([
                    Validators.maxLength(500),
                    Validators.required
                ])]
            });
            
            let today = new Date();
            today.setFullYear(today.getFullYear() - 18);
            this.maxDate = today;    
    }

    async ngOnInit() {
        this.loadingService.show();

        // Get User Claims
        let data: any[] = await this.iamService.iam.getUserClaims();
        // console.log('getUserClaims()', JSON.parse(JSON.stringify(data)));

        // Get Profile Related Claims
        data = data.filter((item: any) => item.profile ? true : false );
        // console.log('Profile Claims', JSON.parse(JSON.stringify(data)));

        // Get the most recent claim
        if (data.length) {
            let tmp: any = data[0].profile;
            this.profileForm.patchValue({
                name: tmp.name,
                birthdate: new Date(tmp.birthdate),
                address: tmp.address
            });
        }

        this.loadingService.hide();
    }

    async save() {
        if (this.profileForm.valid) {
            this.loadingService.show('Please confirm this transaction in your connected wallet.', CancelButton.ENABLED);

            let data = this.profileForm.getRawValue();

            if (data.birthdate) {
                let date = data.birthdate.getTime();
                data = JSON.parse(JSON.stringify(data));
                data.birthdate = date;    
            }
            
            // console.log('data', data);
            try {
                await this.iamService.iam.createSelfSignedClaim({
                    data: {
                        profile: data
                    }
                });
                this.toastr.success('Identity is updated.', 'Success');
                this.dialogRef.close(true);
            }
            catch (e) {
                console.error('Saving Identity Error', e);
                this.toastr.error(e.message, 'System Error')
            }
            finally {
                this.loadingService.hide();
            }
        }
    }
}