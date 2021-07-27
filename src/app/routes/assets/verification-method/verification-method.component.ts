import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VerificationService } from './verification.service';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { KeyTypesEnum } from '../models/keyTypesEnum';
import { isHexValidator } from '../../../utils/validators/is-hex.validator';

export interface PublicKey {
  publicKeyHex: string;
  type: string;
}

@Component({
  selector: 'app-verification-method',
  templateUrl: './verification-method.component.html',
  styleUrls: ['./verification-method.component.scss']
})
export class VerificationMethodComponent implements OnInit {
  pageIndex = 0;
  pageSize = 5;
  verificationsAmount: number;
  dataSource: PublicKey[] = [];
  selectControl = new FormControl('', [Validators.required]);

  publicKeyExistValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const exists = this.dataSource.find(key => key.publicKeyHex === control.value);
      return exists ? {publicKeyExist: {value: control.value}} : null;
    };
  }
  publicKey = new FormControl('',
    [Validators.required, isHexValidator, this.publicKeyExistValidator()]
  );
  selectOptions = Object.entries(KeyTypesEnum);
  private publicKeys;

  constructor(private dialogRef: MatDialogRef<VerificationMethodComponent>,
              @Inject(MAT_DIALOG_DATA) private dialogData: any,
              private verificationService: VerificationService) {
  }

  get isFormDisabled() {
    return !this.selectControl.value || !this.publicKey.valid;
  }

  ngOnInit(): void {
    console.log(Object.entries(KeyTypesEnum));
    this.loadPublicKeys();
  }

  pageEvent(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.setDataSource();
  }

  close(): void {
    this.dialogRef.close();
  }

  add(): void {
    if (this.isFormDisabled) {
      return;
    }

    this.verificationService.updateDocumentAndReload(this.dialogData.id, this.publicKey.value, this.verificationsAmount)
      .subscribe((publicKeys) => {
        this.handleLoadedPublicKeys(publicKeys);
        this.clearControls();
      });
  }

  getPublicKeyErrorMsg() {
    if (this.publicKey.hasError('required')) {
      return 'This field is required';
    }

    if (this.publicKey.hasError('isHexInvalid')) {
      return 'Invalid input. Public key must start with "0x" to be followed by 66 or 130 Hexadecimal characters.';
    }

    if (this.publicKey.hasError('publicKeyExist')) {
      return 'Public key entered already exists, please choose another.';
    }

    return '';
  }

  private clearControls(): void {
    this.selectControl.reset();
    this.publicKey.reset();
  }

  private handleLoadedPublicKeys(publicKeys): void {
    this.publicKeys = publicKeys;
    this.verificationsAmount = publicKeys.length;
    this.setDataSource();
  }

  private setDataSource(): void {
    this.dataSource = this.publicKeys.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize);
  }

  private loadPublicKeys(): void {
    this.verificationService.getPublicKeys(this.dialogData.id, true)
      .subscribe(publicKeys => this.handleLoadedPublicKeys(publicKeys));
  }

}
