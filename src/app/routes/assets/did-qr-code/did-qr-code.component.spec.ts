import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DidQrCodeComponent } from './qr-code.component';

describe('QrCodeComponent', () => {
  let component: DidQrCodeComponent;
  let fixture: ComponentFixture<DidQrCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DidQrCodeComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DidQrCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
