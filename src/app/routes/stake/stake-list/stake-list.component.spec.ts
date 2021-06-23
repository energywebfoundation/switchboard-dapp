import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StakeListComponent } from './stake-list.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

describe('StakeListComponent', () => {
  let component: StakeListComponent;
  let fixture: ComponentFixture<StakeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StakeListComponent],
      providers: [
        {provide: Router, useValue: {}}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StakeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
