import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StakeListCardComponent } from './stake-list-card.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('StakeListCardComponent', () => {
  let component: StakeListCardComponent;
  let fixture: ComponentFixture<StakeListCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StakeListCardComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StakeListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
