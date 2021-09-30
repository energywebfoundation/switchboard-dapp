import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMenuTriggerComponent } from './user-menu-trigger.component';

describe('UserMenuTriggerComponent', () => {
  let component: UserMenuTriggerComponent;
  let fixture: ComponentFixture<UserMenuTriggerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserMenuTriggerComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMenuTriggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
