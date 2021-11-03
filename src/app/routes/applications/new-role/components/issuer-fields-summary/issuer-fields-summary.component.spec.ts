import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuerFieldsSummaryComponent } from './issuer-fields-summary.component';

describe('IssuerFieldsSummaryComponent', () => {
  let component: IssuerFieldsSummaryComponent;
  let fixture: ComponentFixture<IssuerFieldsSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IssuerFieldsSummaryComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuerFieldsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
