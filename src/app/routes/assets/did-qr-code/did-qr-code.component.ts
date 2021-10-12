import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Asset } from 'iam-client-lib';

@Component({
  selector: 'app-did-qr-code',
  templateUrl: './did-qr-code.component.html',
  styleUrls: ['./did-qr-code.component.scss']
})
export class DidQrCodeComponent implements OnInit {
  did: string;

  constructor(public dialogRef: MatDialogRef<DidQrCodeComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Asset) {
  }

  ngOnInit(): void {
    this.did = this.data.id;
  }

}
