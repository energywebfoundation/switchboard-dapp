import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SearchIssuerRoleComponent } from './search-issuer-role.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NamespaceType } from 'iam-client-lib';

describe('SearchIssuerRoleComponent', () => {
  let component: SearchIssuerRoleComponent;
  let fixture: ComponentFixture<SearchIssuerRoleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SearchIssuerRoleComponent],
      providers: [
        MatIconTestingModule,
        MatFormFieldModule,
        NoopAnimationsModule,
      ],

      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchIssuerRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if placeholder is set', () => {
    expect(component.searchPlaceholder).toEqual(
      `Example:issuerrole.${NamespaceType.Role}.myorg.iam.ewc`
    );
  });
});
