import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSingleRecordComponent } from './add-single-record.component';

describe('AddSingleRecordComponent', () => {
  let component: AddSingleRecordComponent;
  let fixture: ComponentFixture<AddSingleRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddSingleRecordComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSingleRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
