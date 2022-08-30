import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserMenuTriggerComponent } from './user-menu-trigger.component';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

describe('UserMenuTriggerComponent', () => {
  let component: UserMenuTriggerComponent;
  let fixture: ComponentFixture<UserMenuTriggerComponent>;
  let hostDebug: DebugElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UserMenuTriggerComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMenuTriggerComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display user name value', () => {
    component.userName = 'user';
    fixture.detectChanges();

    const user = getElement(hostDebug)('trigger-menu-user-name').nativeElement;

    expect(user.innerText).toContain('user');
  });
});
const getElement =
  (hostDebug) =>
  (id, postSelector = '') =>
    hostDebug.query(By.css(`[data-qa-id=${id}] ${postSelector}`));
