import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddSingleRecordComponent } from './add-single-record.component';
import { DidBookService } from '../../services/did-book.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { dialogSpy } from '@tests';

describe('AddSingleRecordComponent', () => {
  let component: AddSingleRecordComponent;
  let fixture: ComponentFixture<AddSingleRecordComponent>;
  let didBookServiceSpy = jasmine.createSpyObj(DidBookService, ['add']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddSingleRecordComponent],
      providers: [
        {provider: DidBookService, useValue: didBookServiceSpy},
        {provider: MatDialogRef, useValue: dialogSpy},
        {provider: MAT_DIALOG_DATA, useValue: {did: 'did'}}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSingleRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add record and close dialog', () => {
    component.addHandler({did: 'did', label: 'label'});
    expect(didBookServiceSpy.add).toHaveBeenCalled();
    expect(dialogSpy.close).toHaveBeenCalled();
  });

  it('should close dialog when handling cancel', () => {
    component.cancelHandler();
    expect(dialogSpy.close).toHaveBeenCalled();
  });
});
