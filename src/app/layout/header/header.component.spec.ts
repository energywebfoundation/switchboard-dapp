import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserIdleService } from 'angular-user-idle';
import { HeaderComponent } from './header.component';
import { MenuService } from '../../core/menu/menu.service';
import { IamService } from '../../shared/services/iam.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../shared/services/notification.service';
import { UserblockService } from '../sidebar/userblock/userblock.service';
import { SettingsService } from '../../core/settings/settings.service';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SwitchboardToasterService } from '../../shared/services/switchboard-toaster.service';

xdescribe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [
        { provide: UserIdleService, useValue: {} },
        { provide: MenuService, useValue: {} },
        { provide: IamService, useValue: {} },
        { provide: Router, useValue: {} },
        { provide: SwitchboardToasterService, useValue: {} },
        { provide: NotificationService, useValue: {} },
        { provide: UserblockService, useValue: {} },
        { provide: SettingsService, useValue: {} },
        { provide: MatDialog, useValue: {} },
        { provide: DomSanitizer, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
