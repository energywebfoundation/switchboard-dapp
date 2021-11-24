import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbSettingsComponent } from './sb-settings.component';

describe('SbSettingsComponent', () => {
  let component: SbSettingsComponent;
  let fixture: ComponentFixture<SbSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SbSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SbSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
