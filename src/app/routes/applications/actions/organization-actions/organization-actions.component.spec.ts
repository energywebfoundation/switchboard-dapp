import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationActionsComponent } from './organization-actions.component';

describe('OrganizationActionsComponent', () => {
  let component: OrganizationActionsComponent;
  let fixture: ComponentFixture<OrganizationActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationActionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
