import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IssuerRequestsComponent } from './issuer-requests.component';
import { TokenDecodeService } from '../services/token-decode.service';
import { dialogSpy } from '@tests';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { provideMockStore } from '@ngrx/store/testing';
import { IssuerRequestsService } from '../services/issuer-requests.service';
import { RoleService } from '../../../../state/governance/role/services/role.service';
import { of } from 'rxjs';

describe('IssuerRequestsComponent', () => {
  let component: IssuerRequestsComponent;
  let fixture: ComponentFixture<IssuerRequestsComponent>;
  const matDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
  const tokenDecodeSpy = jasmine.createSpyObj('TokenDecodeService', [
    'getIssuerFields',
    'getRequestorFields',
  ]);
  let roleSpy;
  beforeEach(
    waitForAsync(() => {
      roleSpy = jasmine.createSpyObj(RoleService, ['getDefinition']);
      TestBed.configureTestingModule({
        declarations: [IssuerRequestsComponent],
        providers: [
          { provide: TokenDecodeService, useValue: tokenDecodeSpy },
          {
            provide: MAT_DIALOG_DATA,
            useValue: { listType: 1, claimData: { claimType: 'test' } },
          },
          { provide: MatDialogRef, useValue: matDialogRefSpy },
          { provide: MatDialog, useValue: dialogSpy },
          { provide: IssuerRequestsService, useValue: {} },
          { provide: RoleService, useValue: roleSpy },
          provideMockStore(),
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuerRequestsComponent);
    component = fixture.componentInstance;
    roleSpy.getDefinition.and.returnValue(of({}));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
