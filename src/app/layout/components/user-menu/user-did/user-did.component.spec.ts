import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserDidComponent } from './user-did.component';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { DidFormatMinifierModule } from '../../../../shared/pipes/did-format-minifier/did-format-minifier.module';

describe('UserDidComponent', () => {
  let component: UserDidComponent;
  let fixture: ComponentFixture<UserDidComponent>;
  let hostDebug: DebugElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UserDidComponent],
      imports: [DidFormatMinifierModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDidComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should check if did is displayed', () => {
    component.did = 'did:ethr:12345678901234567890';
    fixture.detectChanges();

    const user = getElement(hostDebug)('menu-did').nativeElement;

    expect(user.innerText).toContain('did:ethr:123456...67890');
  });
});

const getElement =
  (hostDebug) =>
  (id, postSelector = '') =>
    hostDebug.query(By.css(`[data-qa-id=${id}] ${postSelector}`));
