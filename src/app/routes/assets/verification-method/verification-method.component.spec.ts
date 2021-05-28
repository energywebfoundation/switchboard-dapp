import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationMethodComponent } from './verification-method.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { VerificationService } from './verification.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { TypeAlgorithmPipe } from '../pipes/type-algorithm.pipe';
import { ToastrService } from 'ngx-toastr';
import { DidFormatMinifierPipe } from '../../../shared/pipes/did-format-minifier.pipe';

describe('VerificationMethodComponent', () => {
  let component: VerificationMethodComponent;
  let fixture: ComponentFixture<VerificationMethodComponent>;
  const verificationServiceSpy = jasmine.createSpyObj('VerificationService',
    ['getPublicKeys', 'updateDocumentAndReload']
  );
  const matDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
  const toastrSpy = jasmine.createSpyObj('ToastrService', ['success']);

  const setUp = (documentData: any[]) => {
    verificationServiceSpy.getPublicKeys.and.returnValue(of(documentData));
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerificationMethodComponent, TypeAlgorithmPipe, DidFormatMinifierPipe],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { id: 1 } },
        {
          provide: MatDialogRef, useValue: matDialogRefSpy
        },
        { provide: VerificationService, useValue: verificationServiceSpy },
        { provide: ToastrService, useValue: toastrSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificationMethodComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    setUp([]);
    expect(component).toBeTruthy();
  });

  it('should get document when initializing', () => {
    setUp([]);
    expect(verificationServiceSpy.getPublicKeys).toHaveBeenCalled();
  });

  it('should set values when gets empty list', () => {
    setUp([]);
    expect(component.verificationsAmount).toBe(0);
    expect(component.dataSource.length).toBe(0);
  });

  it('should set values when list have at least 6 elements', () => {
    const list = [{ type: '' }, { type: '' }, { type: '' }, { type: '' }, { type: '' }, { type: '' }];
    setUp(list);
    expect(component.verificationsAmount).toBe(list.length);
    expect(component.dataSource.length).toBe(5);
  });

  it('should close dialog when clicking on close button', () => {
    const close = fixture.nativeElement.querySelector('[data-qa-id=close]');
    close.click();
    expect(matDialogRefSpy.close).toHaveBeenCalled();
  });

});
