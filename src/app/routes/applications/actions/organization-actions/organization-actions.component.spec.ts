import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrganizationActionsComponent } from './organization-actions.component';
import { MatDialog } from '@angular/material/dialog';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

describe('OrganizationActionsComponent', () => {
  let component: OrganizationActionsComponent;
  let fixture: ComponentFixture<OrganizationActionsComponent>;
  let hostDebug: DebugElement;
  const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OrganizationActionsComponent],
      providers: [
        {provide: MatDialog, useValue: dialogSpy}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationActionsComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('stakingUrl', () => {
    it('should check if staking url is undefined when passed element is undefined', () => {
      component.organization = undefined;
      fixture.detectChanges();

      expect(component.stakingUrl).toBeUndefined();
    });

    it('should check if staking url is undefined when passed element without namespace', () => {
      component.organization = {example: ''};
      fixture.detectChanges();

      expect(component.stakingUrl).toBeUndefined();
    });

    it('should generate stakingUrl when passing element with namespace', () => {
      component.organization = {namespace: 'test'};
      fixture.detectChanges();

      expect(component.stakingUrl).toContain('/staking?org=test');
    });
  });

});
