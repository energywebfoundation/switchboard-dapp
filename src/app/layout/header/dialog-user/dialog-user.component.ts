import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from './dialog-user-data';

@Component({
    selector: 'dialog-user',
    templateUrl: 'dialog-user.component.html',
    styleUrls: ['../header.component.scss']
})
export class DialogUser {

    public currentUserKey = '';
    public currentUserData = {};

    constructor(
        public dialogRef: MatDialogRef<DialogUser>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) {

        if (localStorage.getItem('EW-DID-CONFIG')) {
            this.currentUserKey = JSON.parse(localStorage.getItem('EW-DID-CONFIG')).privateKey;
        }

        if (localStorage.getItem('EW-DID-CONFIG') && localStorage.getItem('currentUser')) {
            let didConfig: any = JSON.parse(localStorage.getItem('EW-DID-CONFIG'));
            let currentUser: any = JSON.parse(localStorage.getItem('currentUser'));
            this.currentUserData = {
                'privateKey': didConfig.privateKey,
                'currentUser': currentUser
            }
        }
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    getUserData() {
        return JSON.stringify(this.currentUserData);
    }
}