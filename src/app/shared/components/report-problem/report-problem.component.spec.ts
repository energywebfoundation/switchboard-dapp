import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportProblemComponent } from './report-problem.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ReportProblemComponent', () => {
  let component: ReportProblemComponent;
  let fixture: ComponentFixture<ReportProblemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportProblemComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportProblemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
