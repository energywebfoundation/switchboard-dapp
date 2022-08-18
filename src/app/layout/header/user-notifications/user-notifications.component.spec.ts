import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserNotificationsComponent } from './user-notifications.component';
import { MatMenuModule } from '@angular/material/menu';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';

describe('UserNotificationsComponent', () => {
  let component: UserNotificationsComponent;
  let fixture: ComponentFixture<UserNotificationsComponent>;
  let toastrSpy;

  beforeEach(waitForAsync(() => {
    toastrSpy = jasmine.createSpyObj('SwitchboardToastrService', [
      'newMessagesAmount',
      'getMessageList',
      'areNewNotifications',
      'readAll',
      'reset',
    ]);
    TestBed.configureTestingModule({
      declarations: [UserNotificationsComponent],
      imports: [MatMenuModule],
      providers: [{ provide: SwitchboardToastrService, useValue: toastrSpy }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call read all in toastr ', () => {
    component.menuCloseHandler();
    expect(toastrSpy.readAll).toHaveBeenCalled();
  });

  it('should call reset messages', () => {
    component.clearHandler();
    expect(toastrSpy.reset).toHaveBeenCalled();
  });
});
