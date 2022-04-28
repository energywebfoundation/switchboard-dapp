import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VpHeaderComponent } from './vp-header.component';

describe('VpHeaderComponent', () => {
  let component: VpHeaderComponent;
  let fixture: ComponentFixture<VpHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VpHeaderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VpHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
