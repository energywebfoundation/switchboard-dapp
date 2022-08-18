import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SelectAssetDialogComponent } from './select-asset-dialog.component';
import { DialogDataMock, getElementByCss } from '@tests';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { OwnedAssetsActions, OwnedAssetsSelectors } from '@state';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

describe('SelectAssetDialogComponent', () => {
  let component: SelectAssetDialogComponent;
  let fixture: ComponentFixture<SelectAssetDialogComponent>;
  let dialogMock: DialogDataMock;
  let store: MockStore;
  let dispatchSpy;
  let hostDebug: DebugElement;
  let dialogSpy;

  beforeEach(waitForAsync(() => {
    dialogSpy = jasmine.createSpyObj('MatDialog', [
      'closeAll',
      'open',
      'close',
    ]);
    dialogMock = new DialogDataMock();
    TestBed.configureTestingModule({
      declarations: [SelectAssetDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: dialogMock },
        { provide: MatDialogRef, useValue: dialogSpy },
        provideMockStore(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    store = TestBed.inject(MockStore);
    dispatchSpy = spyOn(store, 'dispatch');
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectAssetDialogComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call action to get list of owned assets', () => {
    fixture.detectChanges();
    expect(dispatchSpy).toHaveBeenCalledWith(
      OwnedAssetsActions.getOwnedAssets()
    );
  });

  it('should display no-records', () => {
    store.overrideSelector(
      OwnedAssetsSelectors.getAssetsWithSelection(null),
      []
    );
    fixture.detectChanges();

    const { noRecords } = selectors(hostDebug);

    expect(noRecords).toBeTruthy();
  });
});

const selectors = (hostDebug) => ({
  noRecords: getElementByCss(hostDebug)('app-no-records')?.nativeElement,
});
