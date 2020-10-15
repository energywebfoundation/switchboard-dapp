import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GovernanceListComponent } from './governance-list.component';

describe('GovernanceListComponent', () => {
  let component: GovernanceListComponent;
  let fixture: ComponentFixture<GovernanceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GovernanceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GovernanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
