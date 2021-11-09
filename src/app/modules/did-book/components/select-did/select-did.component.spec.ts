import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SelectDidComponent } from './select-did.component';
import { DidBookService } from '../../services/did-book.service';
import { MatDialog } from '@angular/material/dialog';
import { dialogSpy, dispatchInputEvent, getElement } from '@tests';
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

describe('SelectDidComponent', () => {
  let component: SelectDidComponent;
  let fixture: ComponentFixture<SelectDidComponent>;
  let hostDebug: DebugElement;
  const didBookServiceSpy = jasmine.createSpyObj(DidBookService, ['add', 'delete', 'getList$']);
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
        NoopAnimationsModule
      ],
      providers: [
        {provide: DidBookService, useValue: didBookServiceSpy},
        {provide: MatDialog, useValue: dialogSpy}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
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
    didBookServiceSpy.getList$.and.returnValue(of([{label: '', did: ''}, {label: '', did: ''}]));
    fixture.detectChanges();
    component.didBook$.subscribe((list) => {
      expect(list.length).toEqual(2);
      done();
    });
  });

  it('should filter out from the list by label', (done) => {
    didBookServiceSpy.getList$.and.returnValue(of([{label: 'label', did: ''}, {label: 'example', did: ''}]));
    fixture.detectChanges();

    const filter = getElement(hostDebug)('owner').nativeElement;

    component.didBook$.pipe(skip(1)).subscribe((list) => {
      expect(list.length).toEqual(1);
      expect(list[0]).toEqual(jasmine.objectContaining({label: 'example'}));
      done();
    });

    filter.value = 'exam';
    dispatchInputEvent(filter);
    fixture.detectChanges();
  });

  it('should filter out from the list by did', (done) => {
    didBookServiceSpy.getList$.and.returnValue(of([{label: 'label', did: 'firstdid'}, {
      label: 'example',
      did: 'seconddid'
    }]));
    fixture.detectChanges();

    const filter = getElement(hostDebug)('owner').nativeElement;

    component.didBook$.pipe(skip(1)).subscribe((list) => {
      expect(list.length).toEqual(1);
      expect(list[0]).toEqual({label: 'label', did: 'firstdid'});
      done();
    });

    filter.value = 'first';
    dispatchInputEvent(filter);
    fixture.detectChanges();
  });

  it('should filter out all elements, the isNotKnownDid property should be truthy', (done) => {
    didBookServiceSpy.getList$.and.returnValue(of([{label: 'label', did: ''}]));
    fixture.detectChanges();

    const filter = getElement(hostDebug)('owner').nativeElement;

    component.didBook$.pipe(skip(1)).subscribe((list) => {
      expect(list.length).toEqual(0);
      expect(component.isNotKnownDid).toBeTrue();
      done();
    });

    filter.value = 'first';
    dispatchInputEvent(filter);
    fixture.detectChanges();
  });

  it('should open dialog when trying to add did to book list', () => {
    component.approveHandler();
    expect(dialogSpy.open).toHaveBeenCalled();
  });
});
