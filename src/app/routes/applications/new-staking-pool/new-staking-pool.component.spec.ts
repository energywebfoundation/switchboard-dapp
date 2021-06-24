import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewStakingPoolComponent } from './new-staking-pool.component';

describe('NewStakingPoolComponent', () => {
  let component: NewStakingPoolComponent;
  let fixture: ComponentFixture<NewStakingPoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewStakingPoolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewStakingPoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
