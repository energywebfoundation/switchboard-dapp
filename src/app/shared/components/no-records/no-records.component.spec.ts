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

  it('should use the short default message', () => {
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('No Record Found');
    expect(text).not.toContain('Make sure all the filters');
  });

  it('should render a custom message', () => {
    const message =
      'No Record Found. Make sure all the filters are applied correctly.';
    fixture.componentRef.setInput('message', message);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(message);
  });
});
