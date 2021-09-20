import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FieldsSummaryComponent } from './fields-summary.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('FieldsSummaryComponent', () => {
  let component: FieldsSummaryComponent;
  let fixture: ComponentFixture<FieldsSummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FieldsSummaryComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
