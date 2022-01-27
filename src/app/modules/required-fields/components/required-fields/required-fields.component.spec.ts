import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RequiredFieldsComponent } from './required-fields.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconTestingModule } from '@angular/material/icon/testing';

describe('RequiredFieldsComponent', () => {
  let component: RequiredFieldsComponent;
  let fixture: ComponentFixture<RequiredFieldsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RequiredFieldsComponent],
        imports: [
          ReactiveFormsModule,
          FormsModule,
          MatFormFieldModule,
          MatInputModule,
          NoopAnimationsModule,
          MatIconTestingModule,
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RequiredFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
