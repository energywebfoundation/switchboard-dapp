import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DidBookComponent } from './did-book.component';
import { DidBookService } from '../../services/did-book.service';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { DialogDataMock, dispatchInputEvent, getElement } from '@tests';
import { skip } from 'rxjs/operators';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('DidBookComponent', () => {
  let component: DidBookComponent;
  let fixture: ComponentFixture<DidBookComponent>;
  let hostDebug: DebugElement;
  const didBookServiceSpy = jasmine.createSpyObj(DidBookService, [
    'add',
    'delete',
    'getList$',
    'getDIDList$',
  ]);
  let dialogMock: DialogDataMock;

  beforeEach(waitForAsync(() => {
    dialogMock = new DialogDataMock();
    TestBed.configureTestingModule({
      declarations: [DidBookComponent],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: DidBookService, useValue: didBookServiceSpy },
        { provide: MAT_DIALOG_DATA, useValue: dialogMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DidBookComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
    didBookServiceSpy.getDIDList$.and.returnValue(of([]));
  });

  it('should create', () => {
    didBookServiceSpy.getList$.and.returnValue(of([]));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should filter out from the list by label', (done) => {
    didBookServiceSpy.getList$.and.returnValue(
      of([
        { label: 'label', did: '' },
        { label: 'example', did: '' },
      ])
    );
    fixture.detectChanges();

    const filter = getElement(hostDebug)('filter-did').nativeElement;

    component.list$.pipe(skip(1)).subscribe((list) => {
      expect(list.length).toEqual(1);
      expect(list[0]).toEqual(jasmine.objectContaining({ label: 'example' }));
      done();
    });

    filter.value = 'exam';
    dispatchInputEvent(filter);
    fixture.detectChanges();
  });

  it('should add record', () => {
    component.addHandler({});
    expect(didBookServiceSpy.add).toHaveBeenCalledWith({});
  });

  it('should delete record', () => {
    component.delete('1');
    expect(didBookServiceSpy.delete).toHaveBeenCalledWith('1');
  });

  it('should get predefined did', () => {
    dialogMock.setData({ did: 'did' });
    fixture.detectChanges();

    expect(component.did).toEqual('did');
  });

  it('should get predefined label', () => {
    dialogMock.setData({ label: 'Foo Bar' });
    fixture.detectChanges();

    expect(component.label).toEqual('Foo Bar');
  });
});
