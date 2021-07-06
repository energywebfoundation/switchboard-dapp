import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StakeComponent } from './stake.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('StakingComponent', () => {
  let component: StakeComponent;
  let fixture: ComponentFixture<StakeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StakeComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
