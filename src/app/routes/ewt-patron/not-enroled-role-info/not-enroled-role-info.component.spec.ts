import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotEnroledRoleInfoComponent } from './not-enroled-role-info.component';

describe('NotEnroledRoleInfoComponent', () => {
  let component: NotEnroledRoleInfoComponent;
  let fixture: ComponentFixture<NotEnroledRoleInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotEnroledRoleInfoComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotEnroledRoleInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
