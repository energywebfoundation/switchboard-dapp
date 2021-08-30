import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StakeSuccessComponent } from './stake-success.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('StakeSuccessComponent', () => {
  let component: StakeSuccessComponent;
  let fixture: ComponentFixture<StakeSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StakeSuccessComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StakeSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
