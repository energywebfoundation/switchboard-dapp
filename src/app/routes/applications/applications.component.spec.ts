import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'src/app/shared/services/dialog/dialog.service';
import { EnvService } from 'src/app/shared/services/env/env.service';
import { IamService } from 'src/app/shared/services/iam.service';
import { UrlParamService } from 'src/app/shared/services/url-param.service';
import { provideMockStore } from '@ngrx/store/testing';
import { MockActivatedRoute, dialogSpy } from '@tests';
import { ApplicationsComponent } from './applications.component';
import { DomainsService } from 'iam-client-lib';

describe('ApplicationsComponent', () => {
  let component: ApplicationsComponent;
  let fixture: ComponentFixture<ApplicationsComponent>;
  let dialog;
  let domainsService;
  const routerSpy = jasmine.createSpyObj('Router', [
    'navigateByUrl',
    'navigate',
  ]);
  let activatedRouteStub: MockActivatedRoute;
  describe('NON-PRODUCTION BEHAVIOR', () => {
    beforeEach(() => {
      dialog = jasmine.createSpyObj(DialogService, ['open']);
      activatedRouteStub = new MockActivatedRoute();
      domainsService = jasmine.createSpyObj('domainsService', ['isOwner']);
      TestBed.configureTestingModule({
        declarations: [ApplicationsComponent],
        providers: [
          { provide: MatDialog, useValue: dialogSpy },
          { provide: EnvService, useValue: { production: false } },
          { provide: IamService, useValue: { domainsService: domainsService } },
          { provide: UrlParamService, useValue: {} },
          { provide: Router, useValue: routerSpy },
          { provide: ActivatedRoute, useValue: activatedRouteStub },
          provideMockStore(),
        ],
      }).compileComponents();
      fixture = TestBed.createComponent(ApplicationsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      domainsService.isOwner.and.returnValue(Promise.resolve(true));
    });
    it('should create Request Organization Button text correctly based on env (non-production)', () => {
      expect(component.orgRequestButtonText).toBe('Create Organization');
    });
  });

  describe('PRODUCTION BEHAVIOR', () => {
    beforeEach(() => {
      dialog = jasmine.createSpyObj(DialogService, ['open']);
      activatedRouteStub = new MockActivatedRoute();
      domainsService = jasmine.createSpyObj('domainsService', ['isOwner']);
      TestBed.configureTestingModule({
        declarations: [ApplicationsComponent],
        providers: [
          { provide: MatDialog, useValue: dialogSpy },
          { provide: EnvService, useValue: { production: true } },
          { provide: IamService, useValue: { domainsService: domainsService } },
          { provide: UrlParamService, useValue: {} },
          { provide: Router, useValue: routerSpy },
          { provide: ActivatedRoute, useValue: activatedRouteStub },
          provideMockStore(),
        ],
      }).compileComponents();
      fixture = TestBed.createComponent(ApplicationsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      domainsService.isOwner.and.returnValue(Promise.resolve(true));
    });
    it('should create Request Organization Button text correctly based on env (production)', () => {
      expect(component.orgRequestButtonText).toBe(
        'Request to Create Organization'
      );
    });
  });
});
