import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RoleNameComponent } from './role-name.component';
import { RoleCreationService } from '../../services/role-creation.service';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('RoleNameComponent', () => {
  let component: RoleNameComponent;
  let fixture: ComponentFixture<RoleNameComponent>;
  const roleCreationServiceSpy = jasmine.createSpyObj(RoleCreationService, ['checkIfUserCanUseDomain']);

  beforeEach(waitForAsync((() => {
    TestBed.configureTestingModule({
      declarations: [RoleNameComponent],
      imports: [
        MatIconTestingModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatInputModule,
        NoopAnimationsModule
      ],
      providers: [
        {provide: RoleCreationService, useValue: roleCreationServiceSpy}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  })));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
