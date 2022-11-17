import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DialogUserComponent } from './dialog-user.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { UserClaimState } from '../../../state/user-claim/user.reducer';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { dispatchInputEvent } from '@tests';
import { UserClaimActions, UserClaimSelectors } from '@state';

describe('DialogUserComponent', () => {
  let component: DialogUserComponent;
  let fixture: ComponentFixture<DialogUserComponent>;
  let hostDebug: DebugElement;
  let store: MockStore<UserClaimState>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DialogUserComponent],
      imports: [ReactiveFormsModule, NoopAnimationsModule, MatInputModule],
      providers: [provideMockStore()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUserComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
  });

  it('should create', () => {
    store.overrideSelector(UserClaimSelectors.getUserData, {} as any);
    expect(component).toBeTruthy();
  });

  it('should update form with values from store', () => {
    const data = {
      name: 'name',
    };
    store.overrideSelector(UserClaimSelectors.getUserData, data as any);
    component.ngOnInit();
    fixture.detectChanges();

    const { name } = getSelectors(hostDebug);

    expect(name.value).toBe(data.name);
  });

  it('should dispatch updateUserClaims action when submitting', () => {
    const { name, submit } = getSelectors(hostDebug);
    const dispatchSpy = spyOn(store, 'dispatch');
    component.ngOnInit();
    fixture.detectChanges();
    name.value = 'name1';
    dispatchInputEvent(name);

    fixture.detectChanges();

    expect(submit.disabled).toBeFalsy();

    submit.click();
    expect(dispatchSpy).toHaveBeenCalledWith(
      UserClaimActions.updateUserData({ userData: { name: 'name1' } })
    );
  });
});

const getSelectors = (hostDebug: DebugElement) => {
  const getElement = (id, postSelector = '') =>
    hostDebug.query(By.css(`[data-qa-id=${id}] ${postSelector}`));

  return {
    submit: getElement('submit').nativeElement,
    name: getElement('dialog-input-name').nativeElement,
    getElement,
  };
};
