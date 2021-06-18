import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderDescriptionComponent } from './provider-description.component';

describe('ProviderDescriptionComponent', () => {
  let component: ProviderDescriptionComponent;
  let fixture: ComponentFixture<ProviderDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProviderDescriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
