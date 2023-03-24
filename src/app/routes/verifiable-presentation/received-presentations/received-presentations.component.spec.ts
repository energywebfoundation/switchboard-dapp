import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivedPresentationsComponent } from './received-presentations.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ReceivedPresentationsComponent', () => {
  let component: ReceivedPresentationsComponent;
  let fixture: ComponentFixture<ReceivedPresentationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReceivedPresentationsComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivedPresentationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
