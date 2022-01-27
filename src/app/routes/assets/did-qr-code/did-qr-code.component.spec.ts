import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DidQrCodeComponent } from './did-qr-code.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { dialogSpy } from '@tests';

describe('QrCodeComponent', () => {
  let component: DidQrCodeComponent;
  let fixture: ComponentFixture<DidQrCodeComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: MatDialogRef, useValue: dialogSpy },
          { provide: MAT_DIALOG_DATA, useValue: { id: 'did:ethr:test' } },
        ],
        declarations: [DidQrCodeComponent],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DidQrCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should did from id', () => {
    expect(component.did).toBe('did:ethr:test');
  });
});
