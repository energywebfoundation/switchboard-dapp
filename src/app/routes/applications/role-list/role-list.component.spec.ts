import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RoleListComponent } from './role-list.component';
import { MatDialog } from '@angular/material/dialog';
import { dialogSpy, iamServiceSpy, loadingServiceSpy, toastrSpy } from '@tests';
import { LoadingService } from '../../../shared/services/loading.service';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { IamService } from '../../../shared/services/iam.service';
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
        {provide: LoadingService, useValue: loadingServiceSpy},
        {provide: SwitchboardToastrService, useValue: toastrSpy},
        {provide: IamService, useValue: iamServiceSpy},
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
