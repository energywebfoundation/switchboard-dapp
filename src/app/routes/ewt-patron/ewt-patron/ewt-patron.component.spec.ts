import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EwtPatronComponent } from './ewt-patron.component';

describe('EwtPatronComponent', () => {
  let component: EwtPatronComponent;
  let fixture: ComponentFixture<EwtPatronComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EwtPatronComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EwtPatronComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
