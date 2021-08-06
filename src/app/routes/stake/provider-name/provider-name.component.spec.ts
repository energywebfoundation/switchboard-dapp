import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderNameComponent } from './provider-name.component';

describe('ProviderNameComponent', () => {
  let component: ProviderNameComponent;
  let fixture: ComponentFixture<ProviderNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProviderNameComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
