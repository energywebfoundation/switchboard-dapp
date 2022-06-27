import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevokeButtonsComponent } from './revoke-buttons.component';

describe('RevokeButtonsComponent', () => {
  let component: RevokeButtonsComponent;
  let fixture: ComponentFixture<RevokeButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevokeButtonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevokeButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
