import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DidBookListComponent } from './did-book-list.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DidBookListComponent', () => {
  let component: DidBookListComponent;
  let fixture: ComponentFixture<DidBookListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DidBookListComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DidBookListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
