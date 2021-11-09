import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SelectDidComponent } from './select-did.component';
import { DidBookService } from '../../services/did-book.service';
import { MatDialog } from '@angular/material/dialog';
import { dialogSpy } from '@tests';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { of } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SelectDidComponent', () => {
  let component: SelectDidComponent;
  let fixture: ComponentFixture<SelectDidComponent>;
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
  });

  it('should create', () => {
    didBookServiceSpy.getList$.and.returnValue(of([]));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
