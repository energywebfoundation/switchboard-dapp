import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrganizationActionsComponent } from './organization-actions.component';
import { MatDialog } from '@angular/material/dialog';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

describe('OrganizationActionsComponent', () => {
  let component: OrganizationActionsComponent;
  let fixture: ComponentFixture<OrganizationActionsComponent>;
  let hostDebug: DebugElement;
  const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
  const element = {namespace: '', owner: ''};
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
    component.element = {...element};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
