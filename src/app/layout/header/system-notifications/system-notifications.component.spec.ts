import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemNotificationsComponent } from './system-notifications.component';

describe('SystemNotificationsComponent', () => {
  let component: SystemNotificationsComponent;
  let fixture: ComponentFixture<SystemNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemNotificationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
