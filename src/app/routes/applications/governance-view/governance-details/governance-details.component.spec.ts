import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovernanceDetailsComponent } from './governance-details.component';

xdescribe('GovernanceDetailsComponent', () => {
  let component: GovernanceDetailsComponent;
  let fixture: ComponentFixture<GovernanceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GovernanceDetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GovernanceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
