import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuNotificationTriggerComponent } from './menu-notification-trigger.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('MenuNotificationTriggerComponent', () => {
  let component: MenuNotificationTriggerComponent;
  let fixture: ComponentFixture<MenuNotificationTriggerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuNotificationTriggerComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuNotificationTriggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
