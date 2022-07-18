import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewRequestsComponent } from './view-requests.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideMockStore } from '@ngrx/store/testing';
import { iamServiceSpy } from '@tests';
import { of } from 'rxjs';
import { TokenDecodeService } from './services/token-decode.service';

describe('ViewRequestsComponent', () => {
  let component: ViewRequestsComponent;
  let fixture: ComponentFixture<ViewRequestsComponent>;
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
          {
            provide: MAT_DIALOG_DATA,
            useValue: { listType: 1, claimData: { claimType: 'test' } },
          },
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
