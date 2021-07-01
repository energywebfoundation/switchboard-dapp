import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleFieldComponent } from './role-field.component';

describe('RoleFieldComponent', () => {
  let component: RoleFieldComponent;
  let fixture: ComponentFixture<RoleFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
