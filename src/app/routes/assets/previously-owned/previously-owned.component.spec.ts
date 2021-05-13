import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviouslyOwnedComponent } from './previously-owned.component';

describe('PreviouslyOwnedComponent', () => {
  let component: PreviouslyOwnedComponent;
  let fixture: ComponentFixture<PreviouslyOwnedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviouslyOwnedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviouslyOwnedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
