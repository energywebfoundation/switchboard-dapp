import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAssetDialogComponent } from './edit-asset-dialog.component';

describe('EditAssetDialogComponent', () => {
  let component: EditAssetDialogComponent;
  let fixture: ComponentFixture<EditAssetDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAssetDialogComponent ]
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
