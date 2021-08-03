import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationActionsComponent } from './application-actions.component';

describe('ApplicationActionsComponent', () => {
  let component: ApplicationActionsComponent;
  let fixture: ComponentFixture<ApplicationActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationActionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
