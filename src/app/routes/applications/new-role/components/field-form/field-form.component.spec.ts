import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldFormComponent } from './field-form.component';

describe('FieldFormComponent', () => {
  let component: FieldFormComponent;
  let fixture: ComponentFixture<FieldFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FieldFormComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
