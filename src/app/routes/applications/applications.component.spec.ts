import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'src/app/shared/services/dialog/dialog.service';
import { EnvService } from 'src/app/shared/services/env/env.service';
import { IamService } from 'src/app/shared/services/iam.service';
import { UrlParamService } from 'src/app/shared/services/url-param.service';
import { provideMockStore } from '@ngrx/store/testing';
import { dialogSpy, MockActivatedRoute } from '@tests';
import { ApplicationsComponent } from './applications.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ApplicationsComponent', () => {
  let component: ApplicationsComponent;
  let fixture: ComponentFixture<ApplicationsComponent>;
  let dialog;
  let domainsService;
  const routerSpy = jasmine.createSpyObj('Router', [
    'navigateByUrl',
    'navigate',
  ]);
  const envService = { orgRequestEmail: '' };
  let activatedRouteStub: MockActivatedRoute;
  beforeEach(() => {
    dialog = jasmine.createSpyObj(DialogService, ['open']);
    activatedRouteStub = new MockActivatedRoute();
    domainsService = jasmine.createSpyObj('domainsService', ['isOwner']);

    TestBed.configureTestingModule({
      declarations: [ApplicationsComponent],
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        { provide: EnvService, useValue: envService },
        { provide: IamService, useValue: { domainsService: domainsService } },
        { provide: UrlParamService, useValue: {} },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        provideMockStore(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(ApplicationsComponent);
    component = fixture.componentInstance;
    domainsService.isOwner.and.returnValue(Promise.resolve(true));
  });
  it('should create "Create Organization" button text when email is empty string', () => {
    envService.orgRequestEmail = '';
    fixture.detectChanges();
    expect(component.orgRequestButtonText).toBe('Create Organization');
  });

  it('should create "Request to Create Organization" button text when organization email is defined', () => {
    envService.orgRequestEmail = 'example@email.com';
    fixture.detectChanges();
    expect(component.orgRequestButtonText).toBe(
      'Request to Create Organization'
    );
  });
});
