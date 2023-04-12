import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawDataComponent } from './raw-data.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('RawDataComponent', () => {
  let component: RawDataComponent;
  let fixture: ComponentFixture<RawDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RawDataComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RawDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
