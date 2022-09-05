import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserNameComponent } from './user-name.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('UserNameComponent', () => {
  let component: UserNameComponent;
  let fixture: ComponentFixture<UserNameComponent>;
  let hostDebug: DebugElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UserNameComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserNameComponent);
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
    const user = getElement(hostDebug)('opened-menu-name').nativeElement;
    expect(user.innerText).toContain('user');
  });
});
const getElement =
  (hostDebug) =>
  (id, postSelector = '') =>
    hostDebug.query(By.css(`[data-qa-id=${id}] ${postSelector}`));
