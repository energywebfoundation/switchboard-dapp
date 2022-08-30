import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewPassiveAssetComponent } from './new-passive-asset.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { AssetService } from '../services/asset.service';

describe('NewPassiveAssetComponent', () => {
  let component: NewPassiveAssetComponent;
  let fixture: ComponentFixture<NewPassiveAssetComponent>;
  const dialogRefSpy = jasmine.createSpyObj(MatDialogRef, ['close']);
  const assetServiceSpy = jasmine.createSpyObj(AssetService, ['register']);
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NewPassiveAssetComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: AssetService, useValue: assetServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPassiveAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog with true value', (done) => {
    assetServiceSpy.register.and.returnValue(of(''));
    component.registerAsset();

    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
    done();
  });
  it('should close dialog with false value', (done) => {
    assetServiceSpy.register.and.returnValue(throwError(''));
    component.registerAsset();

    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
    done();
  });
});
