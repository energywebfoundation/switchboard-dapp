import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PercentButtonsComponent } from './percent-buttons.component';

describe('PercentButtonsComponent', () => {
  let component: PercentButtonsComponent;
  let fixture: ComponentFixture<PercentButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PercentButtonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PercentButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
