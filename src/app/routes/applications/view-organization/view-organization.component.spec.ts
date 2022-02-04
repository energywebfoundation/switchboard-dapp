import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOrganizationComponent } from './view-organization.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ViewOrganizationComponent', () => {
  let component: ViewOrganizationComponent;
  let fixture: ComponentFixture<ViewOrganizationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewOrganizationComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
