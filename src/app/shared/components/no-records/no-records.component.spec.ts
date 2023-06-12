import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoRecordsComponent } from './no-records.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('NoRecordsComponent', () => {
  let component: NoRecordsComponent;
  let fixture: ComponentFixture<NoRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NoRecordsComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
