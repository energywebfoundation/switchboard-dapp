import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { KeyValueListComponent } from './key-value-list.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('KeyValueListComponent', () => {
  let component: KeyValueListComponent;
  let fixture: ComponentFixture<KeyValueListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [KeyValueListComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyValueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
