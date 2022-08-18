import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditAssetDialogComponent } from './edit-asset-dialog.component';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { EditAssetService } from './services/edit-asset.service';
import { dialogSpy, dispatchInputEvent, getElement } from '@tests';
import { of } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

class MockDialogData {
  id: string;
  private _data: any;

  setData(value) {
    this._data = value;
  }

  setId(value) {
    this.id = value;
  }
}

describe('EditAssetDialogComponent', () => {
  let component: EditAssetDialogComponent;
  let fixture: ComponentFixture<EditAssetDialogComponent>;
  const editAssetServiceSpy = jasmine.createSpyObj(EditAssetService, [
    'getProfile',
    'update',
  ]);
  let mockDialogData: MockDialogData;
  let hostDebug: DebugElement;
  beforeEach(waitForAsync(() => {
    mockDialogData = new MockDialogData();
    TestBed.configureTestingModule({
      declarations: [EditAssetDialogComponent],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconTestingModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: EditAssetService, useValue: editAssetServiceSpy },
        { provide: MatDialogRef, useValue: dialogSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAssetDialogComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
  });

  it('should create', () => {
    editAssetServiceSpy.getProfile.and.returnValue(of());
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should update form when claims contains specific asset', () => {
    const assetProfile = {
      name: 'example',
      icon: 'https://',
    };
    mockDialogData.setId('1');
    editAssetServiceSpy.getProfile.and.returnValue(
      of({
        assetProfiles: {
          '1': assetProfile,
        },
      })
    );
    fixture.detectChanges();
    expect(component.form.getRawValue()).toEqual(assetProfile);
  });

  it('should check if form have default values when asset to not have claim', () => {
    mockDialogData.setId('1');
    editAssetServiceSpy.getProfile.and.returnValue(
      of({
        assetProfiles: {},
      })
    );
    fixture.detectChanges();
    expect(component.form.getRawValue()).toEqual({ name: '', icon: '' });
  });

  it('should call update method when form is valid', () => {
    mockDialogData.setId('1');
    editAssetServiceSpy.getProfile.and.returnValue(
      of({
        assetProfiles: {},
      })
    );
    editAssetServiceSpy.update.and.returnValue(of(true));
    fixture.detectChanges();
    const { name, icon, submit } = getSelectors(hostDebug);

    name.value = 'name';
    dispatchInputEvent(name);

    icon.value = 'https://a';
    dispatchInputEvent(icon);

    fixture.detectChanges();

    submit.click();

    expect(editAssetServiceSpy.update).toHaveBeenCalledWith({
      assetProfiles: {
        '1': {
          name: 'name',
          icon: 'https://a',
        },
      },
    });
    expect(dialogSpy.close).toHaveBeenCalledWith(true);
  });
});

const getSelectors = (hostDebug) => {
  return {
    name: getElement(hostDebug)('name')?.nativeElement,
    icon: getElement(hostDebug)('icon')?.nativeElement,
    submit: getElement(hostDebug)('next')?.nativeElement,
  };
};
