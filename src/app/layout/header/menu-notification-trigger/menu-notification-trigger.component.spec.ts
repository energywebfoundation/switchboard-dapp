import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuNotificationTriggerComponent } from './menu-notification-trigger.component';

describe('MenuNotificationTriggerComponent', () => {
  let component: MenuNotificationTriggerComponent;
  let fixture: ComponentFixture<MenuNotificationTriggerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuNotificationTriggerComponent],
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
