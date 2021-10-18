import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArbitraryListComponent } from './arbitrary-list.component';

describe('ArbitraryListComponent', () => {
  let component: ArbitraryListComponent;
  let fixture: ComponentFixture<ArbitraryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArbitraryListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArbitraryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
