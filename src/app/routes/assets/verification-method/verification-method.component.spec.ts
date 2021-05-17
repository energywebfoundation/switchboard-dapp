import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationMethodComponent } from './verification-method.component';

describe('VerificationMethodComponent', () => {
  let component: VerificationMethodComponent;
  let fixture: ComponentFixture<VerificationMethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerificationMethodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificationMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
