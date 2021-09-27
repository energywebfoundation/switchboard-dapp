import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RoleListComponent } from './role-list.component';
import { MatDialog } from '@angular/material/dialog';
import { dialogSpy } from '@tests';
import { ReactiveFormsModule } from '@angular/forms';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

xdescribe('RoleListComponent', () => {
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
      ]
    })
      .compileComponents();

    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
