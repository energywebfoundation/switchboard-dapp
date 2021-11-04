import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequiredFieldsComponent } from './required-fields.component';

describe('RequiredFieldsComponent', () => {
  let component: RequiredFieldsComponent;
  let fixture: ComponentFixture<RequiredFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequiredFieldsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequiredFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
