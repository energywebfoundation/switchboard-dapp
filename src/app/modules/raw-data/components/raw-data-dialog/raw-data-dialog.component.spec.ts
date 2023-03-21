import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RawDataDialogComponent } from './raw-data-dialog.component';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { DialogDataMock } from '@tests';

describe('RawDataDialogComponent', () => {
  let component: RawDataDialogComponent;
  let fixture: ComponentFixture<RawDataDialogComponent>;
  let dialogMock: DialogDataMock;

  beforeEach(waitForAsync(() => {
    dialogMock = new DialogDataMock();
    TestBed.configureTestingModule({
      declarations: [RawDataDialogComponent],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: dialogMock }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RawDataDialogComponent);
    component = fixture.componentInstance;
    dialogMock.setData({ dataToDisplay: {}, header: 'Raw Data' });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
