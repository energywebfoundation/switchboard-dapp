import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DialogUserComponent } from './dialog-user.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { UserClaimState } from '../../../state/user-claim/user.reducer';
import * as userSelectors from '../../../state/user-claim/user.selectors';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';

describe('DialogUserComponent', () => {
  let component: DialogUserComponent;
  let fixture: ComponentFixture<DialogUserComponent>;
  let hostDebug: DebugElement;
  let store: MockStore<UserClaimState>;

  const fieldSelector = (id, postSelector = '') => hostDebug.query(By.css(`[data-qa-id=field-${id}] ${postSelector}`));
  const dispatchEvent = (el) => {
    el.dispatchEvent(new Event('input'));
    el.dispatchEvent(new Event('blur'));
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DialogUserComponent],
      imports: [
        ReactiveFormsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        NoopAnimationsModule,
        MatInputModule,
      ],
      providers: [
        provideMockStore()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUserComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
  });

  it('should create', () => {
    store.overrideSelector(userSelectors.getUserProfile, {});
    expect(component).toBeTruthy();
  });

  it('should update form with values from store', () => {
    const date = new Date('2001-06-12T22:00:00.000Z');
    const data = {
      name: 'name',
      address: '123',
      birthdate: date.getTime()
    };
    store.overrideSelector(userSelectors.getUserProfile, data as any);
    component.ngOnInit();
    fixture.detectChanges();

    const {name, birthdate, address} = setup(hostDebug);

    expect(name.value).toBe(data.name);
    expect(address.value).toBe(data.address);
    expect(new Date(birthdate.value)).toEqual(date);
  });

  it('should dispatch updateUserClaims action when submitting', () => {
    const {name, birthdate, address, submit} = setup(hostDebug);
    const dispatchSpy = spyOn(store, 'dispatch');
    component.ngOnInit();
    fixture.detectChanges();
    name.value = 'name';
    dispatchEvent(name);

    birthdate.value = '1/1/2000';
    dispatchEvent(birthdate);

    address.value = 'Some address';
    dispatchEvent(address);
    fixture.detectChanges();

    expect(submit.disabled).toBeFalsy();

    submit.click();
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should display error message for maximum allowed date', () => {
    const {birthdate} = setup(hostDebug);
    component.ngOnInit();
    fixture.detectChanges();

    birthdate.value = todayDate();
    dispatchEvent(birthdate);

    fixture.detectChanges();
    const matError = hostDebug.query(By.css('mat-error')).nativeElement;

    expect(matError.textContent).toContain('Maximum allowed date is');
  });
});

const setup = (hostDebug: DebugElement) => {
  return {
    submit: hostDebug.query(By.css('[data-qa-id=submit]')).nativeElement,
    name: hostDebug.query(By.css('[data-qa-id=name]')).nativeElement,
    birthdate: hostDebug.query(By.css('[data-qa-id=birthdate]')).nativeElement,
    address: hostDebug.query(By.css('[data-qa-id=address]')).nativeElement,
  };
};

const todayDate = () => {
  const date = new Date(Date.now());
  return `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`;
};
