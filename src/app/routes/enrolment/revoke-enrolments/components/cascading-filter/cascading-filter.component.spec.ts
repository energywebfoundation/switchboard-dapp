import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CascadingFilterComponent } from './cascading-filter.component';

describe('CascadingFilterComponent', () => {
  let component: CascadingFilterComponent;
  let fixture: ComponentFixture<CascadingFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CascadingFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CascadingFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
