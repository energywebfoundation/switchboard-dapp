import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrolToRoleComponent } from './enrol-to-role.component';

describe('EnrolToRoleComponent', () => {
  let component: EnrolToRoleComponent;
  let fixture: ComponentFixture<EnrolToRoleComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [EnrolToRoleComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrolToRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
