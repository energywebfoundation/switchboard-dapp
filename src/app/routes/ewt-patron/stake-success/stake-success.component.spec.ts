import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StakeSuccessComponent } from './stake-success.component';

describe('StakeSuccessComponent', () => {
  let component: StakeSuccessComponent;
  let fixture: ComponentFixture<StakeSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StakeSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StakeSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
