import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RoleListComponent } from './role-list.component';
import { MatDialog } from '@angular/material/dialog';
import { dialogSpy } from '@tests';
import { ReactiveFormsModule } from '@angular/forms';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RoleActions, RoleSelectors } from '@state';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RoleType } from '../new-role/new-role.component';
import { EnvService } from '../../../shared/services/env/env.service';

describe('RoleListComponent', () => {
  let component: RoleListComponent;
  let fixture: ComponentFixture<RoleListComponent>;
  let store: MockStore;

  const setup = (list?) => {
    store.overrideSelector(RoleSelectors.getList, list || []);
    fixture.detectChanges();
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RoleListComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        { provide: EnvService, useValue: { rootNamespace: 'iam.ewc' } },
        provideMockStore(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('should return truthy for checking isOrgType and falsy for others', () => {
    setup();
    expect(component.isOrgType(RoleType.ORG)).toBeTrue();
    expect(component.isAppType(RoleType.ORG)).toBeFalse();
    expect(component.isCustomType(RoleType.ORG)).toBeFalse();
  });

  it('should return truthy for checking isAppType and falsy for others', () => {
    setup();
    expect(component.isOrgType(RoleType.APP)).toBeFalse();
    expect(component.isAppType(RoleType.APP)).toBeTrue();
    expect(component.isCustomType(RoleType.APP)).toBeFalse();
  });

  it('should return truthy for checking isCustomType and falsy for others', () => {
    setup();
    expect(component.isOrgType(RoleType.CUSTOM)).toBeFalse();
    expect(component.isAppType(RoleType.CUSTOM)).toBeFalse();
    expect(component.isCustomType(RoleType.CUSTOM)).toBeTrue();
  });

  it('should refresh list after successful edition', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    setup();
    component.edit();

    expect(dispatchSpy).toHaveBeenCalledWith(RoleActions.getList());
  });

  it('should set list to table', () => {
    setup([{}, {}, {}]);

    expect(component.dataSource.data.length).toBe(3);
  });
});
