import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EkcSettingsComponent } from './ekc-settings.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { dialogSpy, dispatchInputEvent, getElement } from '@tests';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { DialogDataMock } from '../../../tests/mocks/dialog-data-mock';

describe('EkcSettingsComponent', () => {
  let component: EkcSettingsComponent;
  let fixture: ComponentFixture<EkcSettingsComponent>;
  let hostDebug: DebugElement;
  let mockDialogData: DialogDataMock;

  beforeEach(waitForAsync(() => {
    mockDialogData = new DialogDataMock();
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatIconTestingModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
      ],
      declarations: [EkcSettingsComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: MatDialogRef, useValue: dialogSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EkcSettingsComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should check if required field error is displayed', () => {
    fixture.detectChanges();

    const { azureInput } = selectors(hostDebug);

    dispatchInputEvent(azureInput);

    fixture.detectChanges();
    const { matError } = selectors(hostDebug);
    expect(matError.textContent).toContain('required');
  });

  it('should check if url field error is displayed', () => {
    fixture.detectChanges();

    const { azureInput } = selectors(hostDebug);

    azureInput.value = 'value';
    dispatchInputEvent(azureInput);

    fixture.detectChanges();
    const { matError } = selectors(hostDebug);
    expect(matError.textContent).toContain('invalid');
  });

  it('should set predefined url', () => {
    mockDialogData.setData({ url: 'https://test.com' });
    fixture.detectChanges();

    const { azureInput } = selectors(hostDebug);

    expect(azureInput.value).toEqual('https://test.com');
  });
});

const selectors = (hostDebug) => {
  return {
    azureInput: getElement(hostDebug)('azure-url')?.nativeElement,
    matError: hostDebug.query(By.css('mat-error'))?.nativeElement,
  };
};
