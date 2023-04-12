import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentationCredentialsComponent } from './presentation-credentials.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PresentationCredentialsComponent', () => {
  let component: PresentationCredentialsComponent;
  let fixture: ComponentFixture<PresentationCredentialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PresentationCredentialsComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PresentationCredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
