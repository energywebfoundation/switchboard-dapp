import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RoleTypeDidComponent } from './role-type-did.component';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getElement, TestHelper } from '@tests';
import { By } from '@angular/platform-browser';

describe('RoleTypeDidComponent', () => {
  let component: RoleTypeDidComponent;
  let fixture: ComponentFixture<RoleTypeDidComponent>;
  let hostDebug: DebugElement;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RoleTypeDidComponent],
      imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatInputModule,
        MatIconTestingModule,
        NoopAnimationsModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleTypeDidComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should remove element from the list', () => {
    component.dids = [
      'did:ethr:0x' + TestHelper.stringWithLength(40),
      'did:ethr:0xb' + TestHelper.stringWithLength(39),
    ];
    fixture.detectChanges();

    component.remove('did:ethr:0x' + TestHelper.stringWithLength(40));
    expect(component.list.length).toEqual(1);
  });

  it('should add element to the list', () => {
    component.dids = ['did:ethr:0x' + TestHelper.stringWithLength(40)];

    component.add('did:ethr:0xb' + TestHelper.stringWithLength(39));

    expect(component.list.length).toEqual(2);
  });
});

const selectors = (hostDebug) => {
  return {
    issuersLength: getElement(hostDebug)('dids-length')?.nativeElement,
    matError: hostDebug.query(By.css(`mat-error`))?.nativeElement,
  };
};
