import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimRewardComponent } from './claim-reward.component';

describe('ClaimRewardComponent', () => {
  let component: ClaimRewardComponent;
  let fixture: ComponentFixture<ClaimRewardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimRewardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimRewardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
