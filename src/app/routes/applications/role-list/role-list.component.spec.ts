import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RoleListComponent } from './role-list.component';
import { MatDialog } from '@angular/material/dialog';
import { dialogSpy } from '@tests';
import { ReactiveFormsModule } from '@angular/forms';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RoleSelectors } from '@state';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('RoleListComponent', () => {
  let component: RoleListComponent;
  let fixture: ComponentFixture<RoleListComponent>;
  let store: MockStore;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RoleListComponent],
      imports: [ReactiveFormsModule],
      providers: [
        {provide: MatDialog, useValue: dialogSpy},
        provideMockStore()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleListComponent);
    component = fixture.componentInstance;
    store.overrideSelector(RoleSelectors.getFilteredList, []);
    store.overrideSelector(RoleSelectors.getFilters, {organization: '', application: '', role: ''});
    store.overrideSelector(RoleSelectors.isFilterVisible, false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
