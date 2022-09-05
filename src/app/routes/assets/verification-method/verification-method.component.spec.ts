import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VerificationMethodComponent } from './verification-method.component';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { VerificationService } from './verification.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { TypeAlgorithmPipe } from '../pipes/type-algorithm.pipe';
import { By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { KeyTypesEnum } from '../models/keyTypesEnum';
import { DidFormatMinifierModule } from '../../../shared/pipes/did-format-minifier/did-format-minifier.module';
import { MatIconTestingModule } from '@angular/material/icon/testing';

describe('VerificationMethodComponent component tests', () => {
  let component: VerificationMethodComponent;
  let fixture: ComponentFixture<VerificationMethodComponent>;
  const verificationServiceSpy = jasmine.createSpyObj('VerificationService', [
    'getPublicKeys',
    'updateDocumentAndReload',
  ]);
  const matDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

  const setUp = (documentData: any[]) => {
    verificationServiceSpy.getPublicKeys.and.returnValue(of(documentData));
    fixture.detectChanges();
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [VerificationMethodComponent, TypeAlgorithmPipe],
      imports: [DidFormatMinifierModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { id: 1 } },
        {
          provide: MatDialogRef,
          useValue: matDialogRefSpy,
        },
        { provide: VerificationService, useValue: verificationServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

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
    const list = [
      { type: KeyTypesEnum.Ethereum },
      { type: KeyTypesEnum.Ethereum },
      { type: KeyTypesEnum.Ethereum },
      { type: KeyTypesEnum.Ethereum },
      { type: KeyTypesEnum.Ethereum },
      { type: KeyTypesEnum.Ethereum },
    ];
    setUp(list);
    expect(component.verificationsAmount).toBe(list.length);
    expect(component.dataSource.length).toBe(5);
  });

  it('should check if form is disabled when list is empty', () => {
    setUp([]);
    expect(component.isFormDisabled).toBeTrue();
  });
});

describe('VerificationMethodComponent with html', () => {
  let component: VerificationMethodComponent;
  let fixture: ComponentFixture<VerificationMethodComponent>;
  let hostDebug: DebugElement;
  const verificationServiceSpy = jasmine.createSpyObj('VerificationService', [
    'getPublicKeys',
    'updateDocumentAndReload',
  ]);
  const matDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

  const dispatchEvent = (el) => {
    el.dispatchEvent(new Event('input'));
    el.dispatchEvent(new Event('blur'));
  };
  const setUp = (documentData: any[]) => {
    verificationServiceSpy.getPublicKeys.and.returnValue(of(documentData));
    fixture.detectChanges();
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [VerificationMethodComponent, TypeAlgorithmPipe],
      imports: [
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
        MatFormFieldModule,
        NoopAnimationsModule,
        FormsModule,
        MatIconTestingModule,
        MatPaginatorModule,
        DidFormatMinifierModule,
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { id: 1 } },
        {
          provide: MatDialogRef,
          useValue: matDialogRefSpy,
        },
        { provide: VerificationService, useValue: verificationServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificationMethodComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
  });

  it('should check form validators', async () => {
    setUp([]);
    const publicKey = getElement(hostDebug)('public-key').nativeElement;
    publicKey.value = '';
    dispatchEvent(publicKey);
    fixture.detectChanges();

    expect(component.isFormDisabled).toBeTrue();
    expect(component.publicKey.valid).toBeFalse();

    publicKey.value = '0xabc';
    dispatchEvent(publicKey);
    fixture.detectChanges();

    expect(component.publicKey.valid).toBeFalse();
    expect(component.selectControl.valid).toBeFalse();
    expect(component.isFormDisabled).toBeTrue();

    publicKey.value = '0x' + new Array(67).join('a');
    dispatchEvent(publicKey);
    fixture.detectChanges();

    expect(component.publicKey.valid).toBeTrue();
    expect(component.selectControl.valid).toBeFalse();
    expect(component.isFormDisabled).toBeTrue();

    const select = getElement(hostDebug)('select-type').nativeElement;
    select.click();
    fixture.detectChanges();
    await fixture.whenStable().then(() => {
      const option = getElement(hostDebug)('select-option-0').nativeElement;
      option.click();
      expect(component.isFormDisabled).toBeFalse();
    });
  });
});

const getElement =
  (hostDebug) =>
  (id, postSelector = '') =>
    hostDebug.query(By.css(`[data-qa-id=${id}] ${postSelector}`));
