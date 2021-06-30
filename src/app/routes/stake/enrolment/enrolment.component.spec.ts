import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrolmentComponent } from './enrolment.component';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('EnrolmentComponent', () => {
  let component: EnrolmentComponent;
  let fixture: ComponentFixture<EnrolmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnrolmentComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        {provide: MatDialog, useValue: {}}
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrolmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
