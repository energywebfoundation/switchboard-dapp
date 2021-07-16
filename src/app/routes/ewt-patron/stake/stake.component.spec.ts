import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StakeComponent } from './stake.component';

xdescribe('StakeComponent', () => {
  let component: StakeComponent;
  let fixture: ComponentFixture<StakeComponent>;

  beforeEach(waitForAsync( () => {
    TestBed.configureTestingModule({
      declarations: [ StakeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
