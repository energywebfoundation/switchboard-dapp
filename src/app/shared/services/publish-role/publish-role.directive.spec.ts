import { PublishRoleDirective } from './publish-role.directive';
import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PublishRoleService } from './publish-role.service';
import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim';
import { of } from 'rxjs';
import { getElement } from '@tests';
import { Claim, RegistrationTypes } from 'iam-client-lib';

@Component({
  template: `
    <div
      data-qa-id="publish"
      [appPublishRole]="enrolment"
      (updated)="emitted = emitted + 1">
      Publish
    </div>
  `,
})
class TestComponent {
  emitted = 0;
  enrolment = new EnrolmentClaim({
    isAccepted: true,
    registrationTypes: [RegistrationTypes.OffChain, RegistrationTypes.OnChain],
    claimType: '',
  } as Claim)
    .setIsSyncedOnChain(false)
    .setIsSyncedOffChain(false);
}

describe('PublishRoleDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let hostDebug: DebugElement;
  let publishRoleServiceMock: jasmine.SpyObj<PublishRoleService>;
  beforeEach(waitForAsync(() => {
    publishRoleServiceMock = jasmine.createSpyObj('PublishRoleService', [
      'addToDidDoc',
    ]);

    TestBed.configureTestingModule({
      imports: [PublishRoleDirective],
      declarations: [TestComponent],
      providers: [
        { provide: PublishRoleService, useValue: publishRoleServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
  }));

  beforeEach(() => {});

  it('should create component with directive', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should emit value when successfully publish claim', () => {
    publishRoleServiceMock.addToDidDoc.and.returnValue(of(true));
    fixture.detectChanges();
    getElement(hostDebug)('publish').nativeElement.click();

    expect(component.emitted).toEqual(1);
    expect(component.enrolment.isSyncedOnChain).toBeTrue();
    expect(component.enrolment.isSyncedOffChain).toBeTrue();
  });
});
