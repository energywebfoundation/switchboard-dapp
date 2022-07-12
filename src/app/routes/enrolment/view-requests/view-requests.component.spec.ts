import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewRequestsComponent } from './view-requests.component';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { IamService } from '../../../shared/services/iam.service';
import { provideMockStore } from '@ngrx/store/testing';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { dialogSpy, iamServiceSpy, loadingServiceSpy } from '@tests';
import { of } from 'rxjs';
import { TokenDecodeService } from './services/token-decode.service';

describe('ViewRequestsComponent', () => {
  let component: ViewRequestsComponent;
  let fixture: ComponentFixture<ViewRequestsComponent>;
  const matDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
  const switchboardToastrServiceSpy = jasmine.createSpyObj(
    'SwitchboardToastrService',
    ['error', 'success']
  );
  const tokenDecodeSpy = jasmine.createSpyObj('TokenDecodeService', [
    'getIssuerFields',
    'getRequestorFields',
  ]);

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ViewRequestsComponent],
        providers: [
          provideMockStore(),
          { provide: TokenDecodeService, useValue: tokenDecodeSpy },
          { provide: LoadingService, useValue: loadingServiceSpy },
          { provide: IamService, useValue: iamServiceSpy },
          {
            provide: SwitchboardToastrService,
            useValue: switchboardToastrServiceSpy,
          },
          {
            provide: MAT_DIALOG_DATA,
            useValue: { listType: 1, claimData: { claimType: 'test' } },
          },
          { provide: MatDialogRef, useValue: matDialogRefSpy },
          { provide: MatDialog, useValue: dialogSpy },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRequestsComponent);
    component = fixture.componentInstance;
    iamServiceSpy.getDidDocument.and.returnValue(of({ service: [] }));
    iamServiceSpy.getRolesDefinition.and.returnValue(Promise.resolve({}));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
