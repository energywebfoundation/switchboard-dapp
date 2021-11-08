import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SelectDidComponent } from './select-did.component';
import { DidBookService } from '../../services/did-book.service';
import { MatDialog } from '@angular/material/dialog';
import { dialogSpy } from '@tests';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SelectDidComponent', () => {
  let component: SelectDidComponent;
  let fixture: ComponentFixture<SelectDidComponent>;
  const didBookServiceSpy = jasmine.createSpyObj(DidBookService, ['add', 'delete', 'getList$']);
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SelectDidComponent],
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
