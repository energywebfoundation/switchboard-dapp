import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationMethodComponent } from './verification-method.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('VerificationMethodComponent', () => {
  let component: VerificationMethodComponent;
  let fixture: ComponentFixture<VerificationMethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerificationMethodComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificationMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
