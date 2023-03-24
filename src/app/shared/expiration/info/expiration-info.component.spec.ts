import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpirationInfoComponent } from './expiration-info.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ExpirationInfoComponent', () => {
  let component: ExpirationInfoComponent;
  let fixture: ComponentFixture<ExpirationInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExpirationInfoComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpirationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
