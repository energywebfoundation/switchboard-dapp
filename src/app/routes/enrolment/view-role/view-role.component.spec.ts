import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRoleComponent } from './view-role.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ViewRoleComponent', () => {
  let component: ViewRoleComponent;
  let fixture: ComponentFixture<ViewRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewRoleComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
