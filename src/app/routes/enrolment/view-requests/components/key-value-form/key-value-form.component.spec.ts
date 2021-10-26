import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { KeyValueFormComponent } from './key-value-form.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('KeyValueFormComponent', () => {
  let component: KeyValueFormComponent;
  let fixture: ComponentFixture<KeyValueFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [KeyValueFormComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyValueFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
