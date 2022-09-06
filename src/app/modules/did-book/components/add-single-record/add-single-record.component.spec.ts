import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddSingleRecordComponent } from './add-single-record.component';
import { DidBookService } from '../../services/did-book.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { dialogSpy } from '@tests';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

describe('AddSingleRecordComponent', () => {
  let component: AddSingleRecordComponent;
  let fixture: ComponentFixture<AddSingleRecordComponent>;
  const didBookServiceSpy = jasmine.createSpyObj(DidBookService, [
    'add',
    'getDIDList$',
  ]);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddSingleRecordComponent],
      providers: [
        { provide: DidBookService, useValue: didBookServiceSpy },
        { provide: MatDialogRef, useValue: dialogSpy },
        { provide: MAT_DIALOG_DATA, useValue: { did: 'did' } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSingleRecordComponent);
    component = fixture.componentInstance;
    didBookServiceSpy.getDIDList$.and.returnValue(of([]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add record and close dialog', () => {
    component.addHandler({ did: 'did', label: 'label' });
    expect(didBookServiceSpy.add).toHaveBeenCalled();
    expect(dialogSpy.close).toHaveBeenCalled();
  });

  it('should close dialog when handling cancel', () => {
    component.cancelHandler();
    expect(dialogSpy.close).toHaveBeenCalled();
  });
});
