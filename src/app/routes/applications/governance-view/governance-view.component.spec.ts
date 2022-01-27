import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovernanceViewComponent } from './governance-view.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('GovernanceViewComponent', () => {
  let component: GovernanceViewComponent;
  let fixture: ComponentFixture<GovernanceViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GovernanceViewComponent],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GovernanceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
