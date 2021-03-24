import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredefinedIconsComponent } from './predefined-icons.component';

describe('PredefinedIconsComponent', () => {
  let component: PredefinedIconsComponent;
  let fixture: ComponentFixture<PredefinedIconsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredefinedIconsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PredefinedIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
