import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsMenuComponent } from './actions-menu.component';

describe('ActionsMenuComponent', () => {
  let component: ActionsMenuComponent;
  let fixture: ComponentFixture<ActionsMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActionsMenuComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
