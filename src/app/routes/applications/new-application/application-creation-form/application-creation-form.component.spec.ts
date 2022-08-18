import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ApplicationCreationFormComponent } from './application-creation-form.component';
import { dispatchInputEvent, getElement } from '@tests';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { NamespaceType } from 'iam-client-lib';

describe('ApplicationCreationFormComponent', () => {
  let component: ApplicationCreationFormComponent;
  let fixture: ComponentFixture<ApplicationCreationFormComponent>;
  let hostDebug: DebugElement;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        MatIconTestingModule,
      ],
      declarations: [ApplicationCreationFormComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationCreationFormComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should create data for new application', () => {
    component.data = { orgNamespace: 'test.iam.ewc' };
    fixture.detectChanges();
    const nextSpy = spyOn(component.proceed, 'emit');

    const { namespace, appName, description, next } = getSelectors(hostDebug);

    namespace.value = 'test';
    dispatchInputEvent(namespace);

    appName.value = 'application name';
    dispatchInputEvent(appName);

    description.value = 'Description';
    dispatchInputEvent(description);

    fixture.detectChanges();

    expect(next.disabled).toBeFalse();
    next.click();
    fixture.detectChanges();

    expect(nextSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        domain: `test.${NamespaceType.Application}.${component.data.orgNamespace}`,
        name: 'test',
        orgNamespace: `${component.data.orgNamespace}`,
        data: {
          description: 'Description',
          appName: 'application name',
          logoUrl: '',
          websiteUrl: '',
          others: '',
        },
      })
    );
  });

  it('should update application', () => {
    component.isUpdating = true;
    component.data = {
      orgNamespace: 'test.iam.ewc',
      name: 'name',
      definition: {
        appName: 'application name',
        description: 'Description',
      },
    };
    fixture.detectChanges();
    const nextSpy = spyOn(component.proceed, 'emit');

    const { appName, description, next } = getSelectors(hostDebug);

    appName.value = 'new application name';
    dispatchInputEvent(appName);
    fixture.detectChanges();

    description.value = 'New description';
    dispatchInputEvent(description);

    fixture.detectChanges();

    expect(next.disabled).toBeFalse();
    next.click();
    fixture.detectChanges();

    expect(nextSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        domain: `${component.data.name}.${NamespaceType.Application}.${component.data.orgNamespace}`,
        name: `${component.data.name}`,
        orgNamespace: `${component.data.orgNamespace}`,
        data: {
          description: 'New description',
          appName: 'new application name',
          logoUrl: undefined,
          websiteUrl: undefined,
          others: undefined,
        },
      })
    );
  });
});

const getSelectors = (hostDebug) => ({
  logoUrl: getElement(hostDebug)('logo-url')?.nativeElement,
  namespace: getElement(hostDebug)('namespace')?.nativeElement,
  appName: getElement(hostDebug)('app-name')?.nativeElement,
  websiteUrl: getElement(hostDebug)('website-url')?.nativeElement,
  description: getElement(hostDebug)('description')?.nativeElement,
  others: getElement(hostDebug)('others')?.nativeElement,
  cancel: getElement(hostDebug)('cancel')?.nativeElement,
  next: getElement(hostDebug)('next')?.nativeElement,
});
