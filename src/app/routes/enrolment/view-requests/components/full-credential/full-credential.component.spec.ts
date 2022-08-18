import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CredentialJsonComponent } from './full-credential.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CredentialJsonComponent', () => {
  let component: CredentialJsonComponent;
  let fixture: ComponentFixture<CredentialJsonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CredentialJsonComponent],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CredentialJsonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
