import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SystemNotificationsComponent } from './system-notifications.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';

describe('SystemNotificationsComponent', () => {
  let component: SystemNotificationsComponent;
  let fixture: ComponentFixture<SystemNotificationsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SystemNotificationsComponent],
      imports: [MatMenuModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
