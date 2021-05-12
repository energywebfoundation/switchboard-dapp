import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAssetDialogComponent } from './edit-asset-dialog.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

describe('EditAssetDialogComponent', () => {
  let component: EditAssetDialogComponent;
  let fixture: ComponentFixture<EditAssetDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditAssetDialogComponent],
      providers: [
        {provide: MatDialog, useValue: {}}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAssetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
