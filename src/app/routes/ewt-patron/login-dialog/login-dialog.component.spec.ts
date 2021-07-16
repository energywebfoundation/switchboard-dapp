import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoginDialogComponent } from './login-dialog.component';
import { PatronLoginService } from '../patron-login.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LoginDialogComponent', () => {
  let component: LoginDialogComponent;
  let fixture: ComponentFixture<LoginDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginDialogComponent ],
      providers: [
        {provide: PatronLoginService, useValue: {}}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
