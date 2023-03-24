import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VpCardComponent } from './vp-card.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('VpCardComponent', () => {
  let component: VpCardComponent;
  let fixture: ComponentFixture<VpCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VpCardComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VpCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
