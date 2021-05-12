import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPassiveAssetComponent } from './new-passive-asset.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('NewPassiveAssetComponent', () => {
  let component: NewPassiveAssetComponent;
  let fixture: ComponentFixture<NewPassiveAssetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewPassiveAssetComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPassiveAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
