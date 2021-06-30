import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalReviewComponent } from './final-review.component';
import { MatDialogRef } from '@angular/material/dialog';

describe('FinalReviewComponent', () => {
  let component: FinalReviewComponent;
  let fixture: ComponentFixture<FinalReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinalReviewComponent],
      providers: [
        {
          provide: MatDialogRef, useValue: {
            open: () => {
            }
          }
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
