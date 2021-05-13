import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferedToComponent } from './offered-to.component';

describe('OfferedToComponent', () => {
  let component: OfferedToComponent;
  let fixture: ComponentFixture<OfferedToComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfferedToComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferedToComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
