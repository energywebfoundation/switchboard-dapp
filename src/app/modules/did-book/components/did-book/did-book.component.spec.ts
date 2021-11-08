import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DidBookComponent } from './did-book.component';
import { DidBookService } from '../../services/did-book.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DidBookComponent', () => {
  let component: DidBookComponent;
  let fixture: ComponentFixture<DidBookComponent>;
  const didBookServiceSpy = jasmine.createSpyObj(DidBookService, ['add', 'delete', 'getList$']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DidBookComponent],
      providers: [{provide: DidBookService, useValue: didBookServiceSpy}],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DidBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
