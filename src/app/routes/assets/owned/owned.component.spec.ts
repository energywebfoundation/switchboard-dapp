import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnedComponent } from './owned.component';

describe('OwnedComponent', () => {
  let component: OwnedComponent;
  let fixture: ComponentFixture<OwnedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
