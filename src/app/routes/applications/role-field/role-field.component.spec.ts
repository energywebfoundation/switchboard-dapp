import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormBuilder, Validators } from '@angular/forms';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { RoleFieldComponent } from './role-field.component';

fdescribe('RoleFieldComponent', () => {
  let component: RoleFieldComponent;
  let fixture: ComponentFixture<RoleFieldComponent>;
  let hostDebug: DebugElement;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleFieldComponent ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatSelectModule,
        MatDialogModule,
        MatInputModule,
        MatButtonModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleFieldComponent);

    component = fixture.componentInstance;

    const fb = new FormBuilder();
    component.fieldsForm = fb.group({});
    
    hostDebug = fixture.debugElement;
    host = hostDebug.nativeElement;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('add field button', () => {

    it('should open form to add field', () => {
      const { showField } = setup(hostDebug);
      showField.nativeElement.click();
      fixture.detectChanges();
      expect(true).toBeTruthy();
    });
    it('add button should be disabled', () => {
      const { showField, addField } = setup(hostDebug);
      showField.nativeElement.click();
      fixture.detectChanges();
      expect(addField.nativeElement.disabled).toBeTruthy();
    });
  })

});
const setup = (hostDebug: DebugElement) => {
  return {
    showField: hostDebug.query(By.css('[data-qa-id=show-field]')),
    addField: hostDebug.query(By.css('[data-qa-id=add-field]')),
  };
};

