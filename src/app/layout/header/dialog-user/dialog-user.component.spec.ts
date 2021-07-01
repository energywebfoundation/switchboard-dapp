import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DialogUserComponent } from './dialog-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { UserClaimState } from '../../../state/user-claim/user.reducer';
import * as userSelectors from '../../../state/user-claim/user.selectors';

describe('DialogUserComponent', () => {
  let component: DialogUserComponent;
  let fixture: ComponentFixture<DialogUserComponent>;
  const mockStore = jasmine.createSpyObj('Store', ['select']);
  let store: MockStore<UserClaimState>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DialogUserComponent],
      imports: [
        ReactiveFormsModule,
      ],
      providers: [
        provideMockStore()
      ]
    })
      .compileComponents();
    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUserComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    store.overrideSelector(userSelectors.getUserProfile, {});
    expect(component).toBeTruthy();
  });

  it('should update form with values from store', () => {
    store.overrideSelector(userSelectors.getUserProfile, {
      name: 'name',
      address: '123',
      birthdate: new Date('1-1-2000').getTime().toString()
    });

  });
});
