import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserIdleService } from 'angular-user-idle';
import { HeaderComponent } from './header.component';
import { MenuService } from '../../core/menu/menu.service';
import { IamService } from '../../shared/services/iam.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../../shared/services/notification.service';
import { UserblockService } from '../sidebar/userblock/userblock.service';
import { SettingsService } from '../../core/settings/settings.service';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HeaderComponent],
            providers: [
                {provide: UserIdleService, useClass: {}},
                {provide: MenuService, useClass: {}},
                {provide: IamService, useClass: {}},
                {provide: Router, useClass: {}},
                {provide: ToastrService, useClass: {}},
                {provide: NotificationService, useClass: {}},
                {provide: UserblockService, useClass: {}},
                {provide: SettingsService, useClass: {}},
                {provide: MatDialog, useClass: {}},
                {provide: DomSanitizer, useClass: {}},
            ]
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
