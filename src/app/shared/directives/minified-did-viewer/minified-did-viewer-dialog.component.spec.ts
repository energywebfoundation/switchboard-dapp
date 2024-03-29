import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinifiedDidViewerDialogComponent } from './minified-did-viewer-dialog.component';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('MinifiedDidViewerDialogComponent', () => {
  let component: MinifiedDidViewerDialogComponent;
  let fixture: ComponentFixture<MinifiedDidViewerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MinifiedDidViewerDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MinifiedDidViewerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
