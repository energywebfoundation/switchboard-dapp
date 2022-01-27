import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { IamService } from '../../shared/services/iam.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../shared/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SwitchboardToastrService } from '../../shared/services/switchboard-toastr.service';
import { provideMockStore } from '@ngrx/store/testing';
import { LoginService } from '../../shared/services/login/login.service';

xdescribe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [
        { provide: IamService, useValue: {} },
        { provide: Router, useValue: {} },
        { provide: SwitchboardToastrService, useValue: {} },
        { provide: NotificationService, useValue: {} },
        { provide: MatDialog, useValue: {} },
        { provide: LoginService, useValue: {} },
        provideMockStore(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
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
