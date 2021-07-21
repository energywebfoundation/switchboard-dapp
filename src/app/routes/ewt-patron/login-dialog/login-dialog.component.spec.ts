import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoginDialogComponent } from './login-dialog.component';
import { PatronLoginService } from '../patron-login.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as authSelectors from '../../../state/auth/auth.selectors';

describe('LoginDialogComponent', () => {
  let component: LoginDialogComponent;
  let fixture: ComponentFixture<LoginDialogComponent>;
  let store: MockStore;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LoginDialogComponent],
      providers: [
        {provide: MAT_DIALOG_DATA, useValue: {}},
        provideMockStore()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    store.overrideSelector(authSelectors.isMetamaskPresent, true);
    store.overrideSelector(authSelectors.isMetamaskDisabled, false);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
