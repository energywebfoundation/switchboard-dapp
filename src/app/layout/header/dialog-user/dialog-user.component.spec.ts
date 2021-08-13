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
    const date = new Date('2001-06-12');
    const data = {
      name: 'name',
      address: '123',
      birthdate: date.getTime()
    };
    store.overrideSelector(userSelectors.getUserProfile, data as any);
    component.ngOnInit();
    fixture.detectChanges();

    const {name, birthdate, address} = selectors(hostDebug);

    expect(name.value).toBe(data.name);
    expect(address.value).toBe(data.address);

    const birth = new Date(birthdate.value);
    expect(birth.getFullYear()).toEqual(date.getFullYear());
    expect(birth.getDay()).toEqual(date.getDay());
    expect(birth.getMonth()).toEqual(date.getMonth());
  });

  it('should dispatch updateUserClaims action when submitting', () => {
    const {name, birthdate, address, submit} = selectors(hostDebug);
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
    const {birthdate} = selectors(hostDebug);
    component.ngOnInit();
    fixture.detectChanges();

    birthdate.value = todayDate();
    dispatchEvent(birthdate);

    fixture.detectChanges();
    const matError = hostDebug.query(By.css('mat-error')).nativeElement;

    expect(matError.textContent).toContain('Required');
  });
});

const selectors = (hostDebug: DebugElement) => {
  const getElement = (id, postSelector = '') => hostDebug.query(By.css(`[data-qa-id=${id}] ${postSelector}`));

  return {
    submit: getElement('submit').nativeElement,
    name: getElement('name').nativeElement,
    birthdate: getElement('birthdate').nativeElement,
    address: getElement('address').nativeElement,
    getElement
  };
};

const todayDate = () => {
  const date = new Date(Date.now());
  return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
};
