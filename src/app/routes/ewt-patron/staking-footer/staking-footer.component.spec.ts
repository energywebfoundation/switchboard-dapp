import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StakingFooterComponent } from './staking-footer.component';

describe('StakingFooterComponent', () => {
  let component: StakingFooterComponent;
  let fixture: ComponentFixture<StakingFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StakingFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StakingFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
