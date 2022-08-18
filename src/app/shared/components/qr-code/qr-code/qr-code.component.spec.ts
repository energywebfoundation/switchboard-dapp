import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QrCodeComponent } from './qr-code.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('QrCodeComponent', () => {
  let component: QrCodeComponent;
  let fixture: ComponentFixture<QrCodeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }],
      declarations: [QrCodeComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
