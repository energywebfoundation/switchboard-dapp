import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SelectDidComponent } from './select-did.component';
import { DidBookService } from '../../services/did-book.service';
import { MatDialog } from '@angular/material/dialog';
import {
  dialogSpy,
  dispatchInputEvent,
  getElement,
  getElementByCss,
  TestHelper,
} from '@tests';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { of } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { skip } from 'rxjs/operators';
import { DidBookRecord } from '../models/did-book-record';

describe('SelectDidComponent', () => {
  let component: SelectDidComponent;
  let fixture: ComponentFixture<SelectDidComponent>;
  let hostDebug: DebugElement;
  const didBookServiceSpy = jasmine.createSpyObj(DidBookService, [
    'add',
    'delete',
    'getList$',
  ]);

  const setInputValue = (value: string) => {
    const { didInput } = getSelectors(hostDebug);

    didInput.value = value;
    dispatchInputEvent(didInput);
    fixture.detectChanges();
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SelectDidComponent],
      imports: [
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatButtonModule,
        MatSelectModule,
        MatInputModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: DidBookService, useValue: didBookServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectDidComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
  });

  it('should create', () => {
    didBookServiceSpy.getList$.and.returnValue(of([]));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should get all elements from book', (done) => {
    didBookServiceSpy.getList$.and.returnValue(
      of([
        { label: '', did: '' },
        { label: '', did: '' },
      ])
    );
    fixture.detectChanges();
    component.didBook$.subscribe((list) => {
      expect(list.length).toEqual(2);
      done();
    });
  });

  it('should filter out from the list by label', (done) => {
    didBookServiceSpy.getList$.and.returnValue(
      of([
        { label: 'label', did: '' },
        { label: 'example', did: '' },
      ])
    );
    fixture.detectChanges();

    component.didBook$.pipe(skip(1)).subscribe((list) => {
      expect(list.length).toEqual(1);
      expect(list[0]).toEqual(jasmine.objectContaining({ label: 'example' }));
      done();
    });

    setInputValue('exam');
  });

  it('should filter out from the list by did', (done) => {
    didBookServiceSpy.getList$.and.returnValue(
      of([
        { label: 'label', did: 'firstdid' },
        {
          label: 'example',
          did: 'seconddid',
        },
      ])
    );
    fixture.detectChanges();

    component.didBook$.pipe(skip(1)).subscribe((list) => {
      expect(list.length).toEqual(1);
      expect(list[0]).toEqual({
        label: 'label',
        did: 'firstdid',
      } as DidBookRecord);
      done();
    });

    setInputValue('first');
  });

  it('should filter out all elements, the isNotKnownDid property should be truthy', (done) => {
    didBookServiceSpy.getList$.and.returnValue(
      of([{ label: 'label', did: '' }])
    );
    fixture.detectChanges();

    component.didBook$.pipe(skip(1)).subscribe((list) => {
      expect(list.length).toEqual(0);
      expect(component.isNotKnownDid).toBeTrue();
      done();
    });

    setInputValue('first');
  });

  it('should open dialog when trying to add did to book list', () => {
    component.approveHandler();
    expect(dialogSpy.open).toHaveBeenCalled();
  });

  it('should validate that input is required', () => {
    component.isRequired = true;
    didBookServiceSpy.getList$.and.returnValue(
      of([{ label: 'label', did: '' }])
    );
    fixture.detectChanges();

    setInputValue('');

    const { matError } = getSelectors(hostDebug);

    expect(matError.innerText).toContain('DID is required');
  });

  it('should validate that input is not required', () => {
    didBookServiceSpy.getList$.and.returnValue(
      of([{ label: 'label', did: '' }])
    );
    fixture.detectChanges();

    setInputValue('');

    const { matError } = getSelectors(hostDebug);

    expect(matError).toBeFalsy();
  });

  it('should remove predefined DIDs from book list', (done) => {
    didBookServiceSpy.getList$.and.returnValue(
      of([
        { label: 'label', did: '1' },
        { label: 'label', did: '2' },
        { label: 'label', did: '3' },
      ])
    );
    component.didToRemove = ['1', '3'];

    fixture.detectChanges();

    component.didBook$.pipe().subscribe((list) => {
      expect(list.length).toEqual(1);
      expect(list[0].did).toEqual('2');
      done();
    });
  });

  it('should press + icon, emit event and clear input', () => {
    const addSpy = spyOn(component.add, 'emit');
    component.showAddButton = true;
    const DID = 'did:ethr:volta:0xA028720Bc0cc22d296DCD3a26E7E8AAe73c9B6F3';
    didBookServiceSpy.getList$.and.returnValue(of([]));

    component.didToRemove = ['1', '3'];

    fixture.detectChanges();

    setInputValue(DID);

    const { plusIcon } = getSelectors(hostDebug);

    plusIcon.click();
    fixture.detectChanges();

    expect(addSpy).toHaveBeenCalledWith(DID);
  });

  it('should not show add icon', () => {
    didBookServiceSpy.getList$.and.returnValue(of([]));

    fixture.detectChanges();

    const { plusIcon } = getSelectors(hostDebug);

    expect(plusIcon).toBeFalsy();
  });

  it('should display error message about already existing element ', () => {
    component.didToRemove = ['did:ethr:0x' + TestHelper.stringWithLength(40)];
    fixture.detectChanges();

    const { didInput } = getSelectors(hostDebug);
    didInput.value = 'did:ethr:0x' + TestHelper.stringWithLength(40);
    dispatchInputEvent(didInput);
    fixture.detectChanges();

    const { matError } = getSelectors(hostDebug);
    expect(matError.textContent).toContain(
      'This DID already exist on the list'
    );
  });

  it('should display error message when element is not a did', () => {
    fixture.detectChanges();

    const { didInput } = getSelectors(hostDebug);
    didInput.value = 'did:ethr:0x';
    dispatchInputEvent(didInput);
    fixture.detectChanges();

    const { matError } = getSelectors(hostDebug);
    expect(matError.textContent).toContain('DID format is invalid');
  });
});

const getSelectors = (hostDebug) => ({
  didInput: getElement(hostDebug)('did-input')?.nativeElement,
  matError: getElementByCss(hostDebug)('mat-error')?.nativeElement,
  plusIcon: getElement(hostDebug)('add-did')?.nativeElement,
});
