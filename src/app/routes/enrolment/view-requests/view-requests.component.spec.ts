import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRequestsComponent } from './view-requests.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { IamService } from '../../../shared/services/iam.service';
import { provideMockStore } from '@ngrx/store/testing';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { dialogSpy, iamServiceSpy, loadingServiceSpy } from '@tests';

describe('ViewRequestsComponent', () => {
  let component: ViewRequestsComponent;
  let fixture: ComponentFixture<ViewRequestsComponent>;
  const matDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
  const switchboardToastrServiceSpy = jasmine.createSpyObj('SwitchboardToastrService', ['error', 'success']);
  const notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['decreasePendingApprovalCount']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewRequestsComponent],
      providers: [
        provideMockStore(),
        {provide: NotificationService, useValue: notificationServiceSpy},
        {provide: LoadingService, useValue: loadingServiceSpy},
        {provide: IamService, useValue: iamServiceSpy},
        {provide: SwitchboardToastrService, useValue: switchboardToastrServiceSpy},
        {provide: MAT_DIALOG_DATA, useValue: {listType: 1, claimData: 2}},
        {provide: MatDialogRef, useValue: matDialogRefSpy},
        {provide: MatDialog, useValue: dialogSpy},
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should run approve', () => {
    component.approve();

    expect(loadingServiceSpy.show).toHaveBeenCalled();
    expect(loadingServiceSpy.hide).toHaveBeenCalled();
  });
});
