import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IssuerFieldFormComponent } from './issuer-field-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

describe('IssuerFieldFormComponent', () => {
  let component: IssuerFieldFormComponent;
  let fixture: ComponentFixture<IssuerFieldFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [IssuerFieldFormComponent],
      imports: [
        ReactiveFormsModule,
        MatSelectModule,
        NoopAnimationsModule,
        MatInputModule,
        MatButtonModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuerFieldFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
