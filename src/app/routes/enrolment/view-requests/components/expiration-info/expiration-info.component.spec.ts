import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpirationInfoComponent } from './expiration-info.component';

describe('ExpirationInfoComponent', () => {
  let component: ExpirationInfoComponent;
  let fixture: ComponentFixture<ExpirationInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExpirationInfoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpirationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
