import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAssetDialogComponent } from './select-asset-dialog.component';

describe('SelectAssetDialogComponent', () => {
  let component: SelectAssetDialogComponent;
  let fixture: ComponentFixture<SelectAssetDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectAssetDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectAssetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
