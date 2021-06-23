import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StakeListComponent } from './stake-list.component';

describe('StakeListComponent', () => {
  let component: StakeListComponent;
  let fixture: ComponentFixture<StakeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StakeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StakeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
