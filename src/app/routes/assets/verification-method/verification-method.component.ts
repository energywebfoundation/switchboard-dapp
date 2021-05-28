import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VerificationService } from './verification.service';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { AlgorithmsEnum } from '../models/algorithms.enum';
import { ToastrService } from 'ngx-toastr';

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
  verificationsAmount;
  dataSource: PublicKey[] = [];
  selectControl = new FormControl('');
  selectOptions = Object.entries(AlgorithmsEnum);
  private publicKeys;

  constructor(private dialogRef: MatDialogRef<VerificationMethodComponent>,
              @Inject(MAT_DIALOG_DATA) private dialogData: any,
              private verificationService: VerificationService,
              private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.loadPublicKeys();
  }

  pageEvent(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.setDataSource();
  }

  close(): void {
    this.dialogRef.close();
  }

  add(event: Event): void {
    if (!this.selectControl.value) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    this.verificationService.updateDocumentAndReload(this.dialogData.id).subscribe((publicKeys) => {
      this.handleLoadedPublicKeys(publicKeys);
    });
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

  private copied(): void {
    this.toastr.success('Did successfully copied to clipboard.');
  }

}
