import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldsSummaryComponent } from './fields-summary.component';

describe('FieldsSummaryComponent', () => {
  let component: FieldsSummaryComponent;
  let fixture: ComponentFixture<FieldsSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FieldsSummaryComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
