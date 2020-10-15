import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GovernanceViewComponent } from './governance-view.component';

describe('GovernanceViewComponent', () => {
  let component: GovernanceViewComponent;
  let fixture: ComponentFixture<GovernanceViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GovernanceViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GovernanceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
