import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TransactionsCompleteComponent } from './transactions-complete.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TransactionsCompleteComponent', () => {
  let component: TransactionsCompleteComponent;
  let fixture: ComponentFixture<TransactionsCompleteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TransactionsCompleteComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
